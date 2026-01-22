import AnalyzeForm from "./components/AnalyzeForm";
import RequirementsForm from "./components/RequirementsForm";

export default function Page() {
  return (
    <>
      <h1>Playground</h1>
      <RequirementsForm />
      <h1>-----------------------</h1>
      <AnalyzeForm />
    </>
  );
}
