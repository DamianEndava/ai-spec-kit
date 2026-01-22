import { Button } from "@/components/ui/button";
import { SpecResponse } from "@/lib/types";

interface ChatPanelProps {
  result: SpecResponse | null;
  runPrompt: () => Promise<void>;
  error: string | null;
  loading: boolean;
}

const ChatPanel = ({ runPrompt, result, error, loading }: ChatPanelProps) => {
  return (
    <div>
      {error && <p style={{ color: "crimson", marginTop: 16 }}>{error}</p>}
      <p>{result?.questionsToAsk[0]?.question}</p>
      <Button onClick={runPrompt} disabled={loading}>
        {loading ? "Processing..." : "runPrompt"}
      </Button>
    </div>
  );
};

export default ChatPanel;
