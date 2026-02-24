export default function DiffViewer({ diff }) {
  return (
    <>
      <h3>Diff</h3>
      <pre className="diff">{diff}</pre>
    </>
  );
}