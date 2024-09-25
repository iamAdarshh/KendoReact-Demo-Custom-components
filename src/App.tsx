import '@progress/kendo-theme-bootstrap/dist/all.css';
import '@progress/kendo-font-icons/dist/index.css';
import './App.css';
import { useState } from 'react';

import {
  TabStrip,
  TabStripSelectEventArguments,
  TabStripTab,
} from "@progress/kendo-react-layout";
import { formattedDate } from './utils/date-methods';
import Button from './components/Button';
import { ButtonVariants } from './types/ButtonVariants';

import FlightDateTimePicker, { RequestedArrivalDepartureType } from './components/FlightDateTimePicker';


const miniumTabs = 2;

interface SegmentModel {
  id?: number;
  from?: string;
  to?: string;
  departure?: RequestedArrivalDepartureType;
}

const dummySegments: SegmentModel[] = [
  {
    id: 1,
    from: 'IND',
    to: 'JYP',
    departure: {
      date: '2024-12-25',
      rangeQualifier: 'C',
      time: '2024-09-25T09:01:32.701Z'
    }
  },
  {
    id: 2,
    from: 'JYP',
    to: 'SIN',
    departure: {
      date: '2024-12-31',
    }
  },
  {
    id: 3,
    from: 'SIN',
    to: 'IND',
    departure: {
      date: '2025-01-15',
      rangeQualifier: 'C',
      time: '2024-09-25T09:01:32.701Z'
    }
  }
];


function App() {

  const [selectedTab, setSelectedTab] = useState<number>(0);

  const [segments, setSegments] = useState<SegmentModel[]>([...dummySegments]);

  const tabTitle = (segment: SegmentModel) => {
    if (!(segment.from)
      || !(segment.to)
      || !segment?.departure) {
      return "Add details";
    }

    return `${segment.from} - ${segment.to}, ${formattedDate(segment.departure.date ?? "")}`;
  }

  const showScroll = segments.length > 3;

  return (
    <div className="tw-flex tw-flex-col tw-justify-center tw-my-5">

      <div className="tw-mx-auto tw-bg-white tw-shadow-lg tw-rounded tw-flex tw-flex-col tw-justify-center">

        <div className="tw-bg-sky-900 tw-rounded-t tw-p-3">
          <h2 className="tw-font-semilight tw-text-xl tw-text-neutral-100 tw-tracking-tight">Master Pricer Search</h2>
        </div>

        <TabStrip
          style={{ width: "800px" }}
          selected={selectedTab}
          scrollable={showScroll}
          onSelect={(e: TabStripSelectEventArguments) => setSelectedTab(e.selected)}
        >

          {segments.map((segment, index) => (
            <TabStripTab
              contentClassName='k-tabstrip-content-width'
              key={index}
              title={
                <div className="tw-flex tw-flex-col">
                  <div className="tw-flex tw-flex-row tw-gap-3 tw-justify-between">
                    <div className="tw-flex tw-flex-row tw-gap-3 tw-items-center">
                      <i className="fa-sharp fa-light fa-plane"></i>
                      <span>Flight {index + 1}</span>
                    </div>
                    {index >= miniumTabs && (
                      <span
                        className="k-icon k-font-icon k-i-x"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSegments(segments.filter((_, i) => i !== index));
                          setSelectedTab(0);
                        }}
                      ></span>
                    )}
                  </div>
                  <span>{tabTitle(segment)}</span>
                </div>
              }>
              <div className="tw-flex tw-flex-col">
                <div className="tw-grid tw-grid-cols-4 tw-gap-5">
                  <div className="tw-col-span-2">
                    <div className="tw-flex tw-flex-col tw-gap-3">
                      <label>From</label>
                      <input
                        value={segment.from}
                        className='tw-block tw-w-full tw-rounded-md tw-border-0 tw-px-3 tw-py-1.5 tw-text-gray-900 tw-shadow-sm tw-ring-1 tw-ring-inset tw-ring-gray-300 placeholder:tw-text-gray-400 focus:tw-ring-2 focus:tw-ring-inset focus:tw-ring-indigo-600 sm:tw-text-sm sm:tw-leading-6'
                        onChange={(e) => setSegments(segments.map((s, i) => i === index ? { ...s, from: e.target.value } : s))}
                      />
                    </div>
                  </div>
                  <div className="tw-col-span-2">
                    <div className="tw-flex tw-flex-col tw-gap-3">
                      <label>To</label>
                      <input
                        value={segment.to}
                        className='tw-block tw-w-full tw-rounded-md tw-border-0 tw-px-3 tw-py-1.5 tw-text-gray-900 tw-shadow-sm tw-ring-1 tw-ring-inset tw-ring-gray-300 placeholder:tw-text-gray-400 focus:tw-ring-2 focus:tw-ring-inset focus:tw-ring-indigo-600 sm:tw-text-sm sm:tw-leading-6'
                        onChange={(e) => setSegments(segments.map((s, i) => i === index ? { ...s, to: e.target.value } : s))}
                      />
                    </div>
                  </div>
                  <div className="tw-col-span-2">
                    <div className="tw-flex tw-flex-col tw-gap-3">
                      <label>Departure</label>
                      <FlightDateTimePicker
                        value={segment.departure}
                        onChange={(e?: RequestedArrivalDepartureType) =>
                          setSegments(segments.map((s, i) => i === index ? { ...s, departure: e } : s))
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabStripTab>
          ))}
          <TabStripTab
            title={
              <Button
                variant={ButtonVariants.Link}
                onClick={() => {
                  setSegments([...segments, {
                    id: segments.length + 1,
                    from: "",
                    to: "",
                    departure: {}
                  }]);
                  setSelectedTab(segments.length);
                }}
              >
                <i className="fa-light fa-plus"></i>
                <span>Add Flight</span>
              </Button>
            }
          ></TabStripTab>
        </TabStrip>

      </div>
      <pre>{JSON.stringify(segments, null, 2)}</pre>
    </div>
  )
}

export default App
