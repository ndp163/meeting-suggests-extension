import "./style.css"
import TranscribePage from './pages/transcribe';
import { useState } from 'react';
import HistoryPage from './pages/history';
import SummaryPage from './pages/summary';


enum PAGE {
  TRANSCRIBE,
  HISTORY,
  SUMMARY
}

function IndexSidePanel() {
  const [page, setPage] = useState(PAGE.TRANSCRIBE);
  const [meetingId, setMeetingId] = useState(Date.now());

  return (
    <>
      <ul className='flex justify-around mt-2'>
        <li className={'cursor-pointer ' + (page === PAGE.TRANSCRIBE ? 'border-sky-500 border-b-[3px]' : 'hover:border-sky-200 hover:border-b-[3px]')} onClick={() => setPage(PAGE.TRANSCRIBE)}>Transcribe</li>
        <li className={'cursor-pointer ' + (page === PAGE.HISTORY ? 'border-sky-500 border-b-[3px]' : 'hover:border-sky-200 hover:border-b-[3px]')} onClick={() => setPage(PAGE.HISTORY)}>History</li>
        <li className={'cursor-pointer ' + (page === PAGE.SUMMARY ? 'border-sky-500 border-b-[3px]' : 'hover:border-sky-200 hover:border-b-[3px]')} onClick={() => setPage(PAGE.SUMMARY)}>Summary</li>
      </ul>
      {page === PAGE.TRANSCRIBE && <TranscribePage meetingId={ meetingId } />}
      {page === PAGE.HISTORY && <HistoryPage />}
      {page === PAGE.SUMMARY && <SummaryPage />}
    </>
  )
}

export default IndexSidePanel;
