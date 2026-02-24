export default function SummaryBox({ summary }) {
  return (
    <>
      <h3>AI Summary</h3>
      <pre className="summary">{summary}</pre>
    </>
  );
}