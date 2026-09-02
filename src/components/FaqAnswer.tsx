/**
 * Renders FAQ answer text with **bold** markdown segments as <strong>.
 */
export default function FaqAnswer({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <p className="px-5 pb-5 text-sm text-forest-600/70 leading-relaxed">
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-semibold text-forest-800">{part.slice(2, -2)}</strong>;
        }
        return part;
      })}
    </p>
  );
}
