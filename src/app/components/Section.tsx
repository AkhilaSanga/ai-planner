type Props = {
  title: string;
  content: string;
};

export default function Section({ title, content }: Props) {
  return (
    <div className="border rounded-md p-5 bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-700 whitespace-pre-line">
        {content}
      </p>
    </div>
  );
}