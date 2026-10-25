// The reader and scenes share a row; Europe's long page can still scroll.
export default function StoryWorkspace({active,children}) {
 return <div className={active?'story-workspace':undefined}>{children}</div>;
}
