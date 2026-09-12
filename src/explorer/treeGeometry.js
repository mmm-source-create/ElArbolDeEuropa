// Geometría de los conectores del árbol. Independiente de los datos históricos.
export function mergeIntervals(intervals, margin = 0) {
  const sorted = intervals
    .map(([start, end]) => [Math.min(start, end), Math.max(start, end)])
    .sort((a, b) => a[0] - b[0]);
  const merged = [];
  sorted.forEach(([start, end]) => {
    const last = merged[merged.length - 1];
    if (last && start <= last[1] + margin) last[1] = Math.max(last[1], end);
    else merged.push([start, end]);
  });
  return merged;
}

export function assignIntervalLanes(requests, margin = 10) {
  if (!requests.length) return { assignment: {}, count: 0 };
  const lanes = [];
  requests
    .slice()
    .sort((a, b) => a.x1 - b.x1 || a.x2 - b.x2)
    .forEach((request) => {
      let bestLane = -1;
      let bestEnd = -Infinity;
      lanes.forEach((lane, index) => {
        if (lane.end + margin <= request.x1 && lane.end > bestEnd) {
          bestLane = index;
          bestEnd = lane.end;
        }
      });
      if (bestLane < 0) {
        lanes.push({ end: request.x2, requests: [request] });
      } else {
        lanes[bestLane].requests.push(request);
        lanes[bestLane].end = Math.max(lanes[bestLane].end, request.x2);
      }
    });

  const orderedLanes = lanes
    .map((lane) => ({
      ...lane,
      preference: lane.requests.reduce((sum, request) => sum + (request.preference ?? 0.5), 0) / lane.requests.length,
    }))
    .sort((a, b) => a.preference - b.preference);

  const assignment = {};
  orderedLanes.forEach((lane, laneIndex) => {
    lane.requests.forEach((request) => { assignment[request.id] = laneIndex; });
  });
  return { assignment, count: orderedLanes.length };
}

export function dedupePts(points) {
  if (!points.length) return [];
  const result = [points[0]];
  for (let index = 1; index < points.length; index += 1) {
    const [x, y] = points[index];
    const [previousX, previousY] = result[result.length - 1];
    if (Math.abs(x - previousX) > 0.5 || Math.abs(y - previousY) > 0.5) result.push(points[index]);
  }
  return result;
}

export function dist(x0, y0, x1, y1) {
  return Math.hypot(x1 - x0, y1 - y0);
}

export function pointToward(x1, y1, x2, y2, distance) {
  const length = dist(x1, y1, x2, y2) || 1;
  const factor = Math.min(distance, length / 2) / length;
  return [x1 + (x2 - x1) * factor, y1 + (y2 - y1) * factor];
}

export function roundedPath(rawPoints, radius = 8) {
  const points = dedupePts(rawPoints);
  if (!points.length) return "";
  if (points.length < 3) return `M ${points.map((point) => point.join(" ")).join(" L ")}`;
  let d = `M ${points[0][0]} ${points[0][1]}`;
  for (let index = 1; index < points.length - 1; index += 1) {
    const [x0, y0] = points[index - 1];
    const [x1, y1] = points[index];
    const [x2, y2] = points[index + 1];
    const before = pointToward(x1, y1, x0, y0, radius);
    const after = pointToward(x1, y1, x2, y2, radius);
    d += ` L ${before[0]} ${before[1]} Q ${x1} ${y1} ${after[0]} ${after[1]}`;
  }
  const last = points[points.length - 1];
  return `${d} L ${last[0]} ${last[1]}`;
}

