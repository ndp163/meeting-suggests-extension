import { useStorage } from "@plasmohq/storage/hook";
import { Storage } from "@plasmohq/storage"
import { socket } from "../socket";
import { useEffect, useState } from 'react';
import { STORAGE_KEY, type Transcript } from '../constants';

interface Props {
  content: Transcript;
  index: number;
  meetingId: number;
}

export default function TextBox({ content, index, meetingId }: Props) {
  const [meetings, setMeetings] = useStorage({
    key: STORAGE_KEY,
    instance: new Storage({
      area: "local"
    })
  });
  const [suggestedAnswer, setSuggestedAnswer] = useState("");

  useEffect(() => {
    if (!meetings) return;

    const onSuggestedAnswer = (data) => {
      if (data.contentIndex === index) {
        setSuggestedAnswer((suggestedAnswer) => {
          if (data.isFinish) {
            setMeetings((meetings) => {
              meetings[meetingId].contents[index].suggest = suggestedAnswer + data.contentChunk;
              return meetings;
            }) 
          }
          return suggestedAnswer + data.contentChunk;
        });
      }
    }
    socket.on('suggested_answer', onSuggestedAnswer);

    return () => {
      socket.off("suggested_answer", onSuggestedAnswer);
    }
  }, [meetings]);

  const translateText = async (content: Transcript) => {
    const response = await fetch("http://localhost:3000/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: content.origin
      })
    });
    const translated = await response.json();
    setMeetings((meetings) => {
      meetings[meetingId].contents[index].translated = translated;

      return meetings;
    });
  };

  const suggestAnswer = async (content: Transcript) => {
    // const response = await fetch("http://localhost:3000/suggest", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify({
    //     text: content.origin
    //   })
    // });
    socket.emit("suggest_answer", {
      contentIndex: index,
      text: content.origin
    });
  };

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

        {content.suggest && (
          <div className="pt-4 rounded">
            <span className="font-bold">Suggest</span>
            {content.suggest.split("\n").map((item) => (
              <p>{item}</p>
            ))}
          </div>
        )}

         {!content.suggest && suggestedAnswer && (
          <div className="pt-4 rounded">
            <span className="font-bold">Suggested Answer</span>
            {suggestedAnswer.split("\n").map((item) => (
              <p>{item}</p>
            ))}
          </div>
        )}

        <div className="flex justify-end mt-2">
          {!content.translated && (
            <button
              className="mr-2 bg-teal-100 hover:bg-teal-200 px-2 py-1 rounded"
              onClick={() => translateText(content)}>
              Translate
            </button>
          )}
          {!content.suggest && (
            <button
              className="mr-2 bg-blue-100 hover:bg-blue-200 px-2 py-1 rounded"
              onClick={() => suggestAnswer(content)}>
              Suggest
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
