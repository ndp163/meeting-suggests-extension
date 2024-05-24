import type { HistoryText } from "../sidepanel"

interface Props {
  content: HistoryText
  translateText: (content: HistoryText) => void
}

export default function TextBox({ content, translateText }: Props) {
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
            onClick={() => translateText(content)}>
            Translate
          </button>
        )}
      </div>
    </div>
  )
}
