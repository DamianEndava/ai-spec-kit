import { SpecResponse } from "@/lib/types";

interface SpecificationBuilderProps {
  result: SpecResponse | null;
}

const SpecificationBuilder = ({ result }: SpecificationBuilderProps) => {
  return (
    <div className="p-4 bg-gray-100 rounded-lg overflow-auto  w-97/100">
      <pre className="text-sm">
        <code>{JSON.stringify(result?.specDraft, null, 2)}</code>
      </pre>
    </div>
  );
};

export default SpecificationBuilder;
