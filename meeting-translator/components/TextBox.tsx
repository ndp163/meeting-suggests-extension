import type { HistoryText } from "../sidepanel"

interface Props {
  content: HistoryText
}

export default function TextBox({ content }: Props) {
  async function translateText() {
    const response = await fetch("http://localhost:3000/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: content.origin
      })
    })
    content.translated = await response.json();
  }

  return (
    <div className="mb-2">
      <div className="flex items-center">
        <img className="w-8 rounded" alt="" src={content.avatar} />
        <span className="font-bold ml-2">{content.name}</span>
      </div>
      <div className="bg-teal-50 p-2 rounded mt-2 ml-4">
        <span className="font-bold">origin</span>
        <p>{content.origin}</p>

        {content.translated && (
          <div className="pt-4 rounded">
            <span className="font-bold">Translated</span>
            <p>{content.translated}</p>
          </div>
        )}

        {!content.translated && (
          <button
            className="block ml-auto bg-teal-100 hover:bg-teal-200 px-2 py-1 rounded"
            onClick={translateText}>
            Translate
          </button>
        )}
      </div>
    </div>
  )
}
