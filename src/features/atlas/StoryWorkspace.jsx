// The floating reader must not change the scene's height or constrain Europe's
// long page. The tree, map and biography keep their normal workspace geometry.
export default function StoryWorkspace({active,children}) {
 return <div className={active?'story-workspace':undefined}>{children}</div>;
}
