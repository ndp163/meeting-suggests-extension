import { useEffect, useState } from "react";
import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook";
import { STORAGE_KEY } from '../constants';

export default function SummaryPage() {
  const [meetings] = useStorage({
    key: STORAGE_KEY,
    instance: new Storage({
      area: "local"
    })
  });
  const [meetingSummaries, setMeetingSummaries] = useState([]);
  const [meetingId, setMeetingId] = useState(null);

  useEffect(() => {
    if (!meetings) {
      return;
    }
    const meetingSummaries = Object.values(meetings)
      .map((meeting) => ({
        id: meeting.startAt,
        title: meeting.title,
        startAt: meeting.startAt,
        summary: meeting.summary
      }))
      .filter((meeting) => meeting.summary);
    setMeetingSummaries(meetingSummaries.toReversed());
  }, [meetings]);

  return (
    <div className="m-2 mt-4">
      {!meetingId && (
        <>
          <h2 className="pb-1 text-lg">Summary</h2>
          <ul>
            {meetingSummaries?.map((meeting) => (
              <li
                key={meeting.startAt}
                className="p-2 hover:bg-slate-100 hover:cursor-pointer"
                onClick={() => setMeetingId(meeting.id)}>
                <h3 className="font-semibold pb-1 text-sm">{meeting.title}</h3>
                <span className="italic">
                  {new Date(meeting.startAt).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
      {meetingId && (
        <>
          <div className="flex justify-between">
            <button
              className="mb-2 py-1.5 px-4 bg-slate-50 border border-slate-400 hover:bg-slate-100 rounded"
              onClick={() => setMeetingId(null)}>
              Back
            </button>
          </div>
          {meetings[meetingId].summary.split("\n").map((line, index) => {
            if (/^\*\*.*\*\*$/.test(line)) {
              return (
                <p className="font-bold mt-2 mb-1" key={index}>
                  {line}
                </p>
              );
            }
            return <p key={index}>{line}</p>;
          })}
        </>
      )}
    </div>
  );
}
