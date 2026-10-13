"""Split composite coastal cells without changing their outer geometry.

The archive retains the original paths. Existing curve segments are preserved;
only internal closing seams are new. Seams are regional approximations, not
surveyed medieval boundaries. --check verifies the accepted SVG without writing.
"""
import argparse
import hashlib
import json
import re
from shapely.ops import unary_union
from svgpathtools import Line, Path, parse_path
from map_geometry import geometry, paths
from project_paths import DATA_DIR


def closed(segments):
    result = list(segments)
    if result[-1].end != result[0].start:
        result.append(Line(result[-1].end, result[0].start))
    return Path(*result)


def parts(item):
    if hashlib.sha256(item['originalD'].encode()).hexdigest() != item['sha256']:
        raise ValueError('Original geometry archive changed: ' + item['id'])
    loops = [closed(loop) for loop in parse_path(item['originalD']).continuous_subpaths()]
    result = {}
    for part in item['parts']:
        segments = []
        for run in part['runs']:
            loop = loops[run['loop']]
            segments.extend(loop[run['start']:run['stop']])
        result[part['id']] = ' '.join([closed(segments).d(),
            *(loops[index].d() for index in part.get('extraLoops', []))])
    # SVG fill closes open loops implicitly. Make that last segment explicit
    # in both measurements; the legacy sampler otherwise omits its endpoint.
    original = geometry(' '.join(loop.d() for loop in loops))
    shapes = [geometry(value) for value in result.values()]
    union = unary_union(shapes)
    if original.symmetric_difference(union).area > 2e-7:
        raise ValueError('Outer coastline changed: ' + item['id'])
    if sum(shape.area for shape in shapes) - union.area > 2e-7:
        raise ValueError('Overlapping subdivisions: ' + item['id'])
    return result


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    review = json.loads((DATA_DIR / 'coastal-subdivisions.json').read_text())
    source = DATA_DIR / 'euv-locations-crop.svg'
    text = source.read_text()
    actual = paths(source)
    for item in review['subdivisions']:
        derived = parts(item)
        for ident, value in derived.items():
            if args.check and actual.get(ident) != value:
                raise ValueError('Subdivision not reproduced: ' + ident)
        if not args.check:
            pattern = r'<path\b[^>]*\bid="' + re.escape(item['id']) + r'"[^>]*/>'
            matches = list(re.finditer(pattern, text))
            if len(matches) != 1:
                raise ValueError('Ambiguous parent path: ' + item['id'])
            template = matches[0].group()
            for ident in derived:
                if ident != item['id']:
                    text = re.sub(r'<path\b[^>]*\bid="' + re.escape(ident) + r'"[^>]*/>', '', text)
            tags = []
            for ident, value in derived.items():
                tag = re.sub(r'\bid="[^"]*"', lambda _: 'id="' + ident + '"', template)
                tag = re.sub(r'\bd="[^"]*"', lambda _: 'd="' + value + '"', tag)
                tags.append(tag)
            text = re.sub(pattern, lambda _: ''.join(tags), text)
    if not args.check:
        source.write_text(text)
    print('Coastal subdivisions reproduced; 0 changed outer area; 0 overlapping area.')


if __name__ == '__main__':
    main()
