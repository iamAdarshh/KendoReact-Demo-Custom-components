import { Calendar, DateInputProps, DateTimePicker, TimePart } from "@progress/kendo-react-dateinputs";
import { normalize } from "../utils/date-methods";
import { useRef, useState } from "react";
import { Popup, PopupProps } from "@progress/kendo-react-popup";
import Button from "./Button";
import { ButtonVariants } from "../types/ButtonVariants";
import RadioButton from "./RadioButton";
import { ButtonGroup } from "@progress/kendo-react-buttons";
import { useOnClickOutside } from "usehooks-ts";

export interface RequestedArrivalDepartureType {
    date?: string;
    time?: string;
    rangeQualifier?: string;
}

// Define formatters once to avoid repeated instantiation unless locale or options change
const dateFormatter = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
});

const timeFormatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
});

// Improved type definition with clearer naming
interface FlightDateTimePickerInputProps extends DateInputProps {
    onClick?: () => void;
    selection?: RequestedArrivalDepartureType;
}

// Component name is explicit and consistent with naming conventions
const FlightDateTimePickerInput: React.FC<FlightDateTimePickerInputProps> = ({ onClick, selection }) => {
    const formattedDate = selection?.date ? dateFormatter.format(normalize(selection.date)) : '';
    const formattedTime = selection?.time ? timeFormatter.format(normalize(selection.time)) : '';
    const isExact = !selection?.rangeQualifier;

    return (
        <span className="k-dateinput k-input tw-w-full" onClick={onClick}>
            <span className='tw-mx-3 tw-flex tw-gap-1 tw-items-center'>
                {formattedDate && <span>{formattedDate}</span>}
                {!isExact && <span className='tw-text-blue-400'>(± 1)</span>}
                {formattedTime && <span>{formattedTime}</span>}
            </span>
        </span>
    );
};

type FlightDateTimePickerPopupProps = PopupProps & {
    value?: RequestedArrivalDepartureType;
    min?: Date;
    max?: Date;
    format?: string;
    //onChange?: (e: RequestedArrivalDepartureType) => void;
    onCancel?: () => void;
    onSubmit?: (e: RequestedArrivalDepartureType) => void;
};


function FlightDateTimePickerPopup(props: FlightDateTimePickerPopupProps) {

    const [type, setType] = useState<"date" | "time">("date");

    const [model, setModel] = useState<RequestedArrivalDepartureType>(props.value || {});

    const popupRef = useRef<HTMLDivElement>(null);
    useOnClickOutside(popupRef, () => props.onCancel?.());

    return (
        <Popup
            {...props}
        >
            <div ref={popupRef} className="k-date-tab k-datetime-wrap">
                <div className="tw-flex tw-flex-col">
                    <div className="k-datetime-buttongroup">
                        <ButtonGroup className='k-button-group-stretched'>
                            <Button
                                className='tw-justify-center'
                                variant={type === "date" ? ButtonVariants.Primary : ButtonVariants.Light}
                                onClick={() => setType("date")}>
                                <span>Date</span>
                            </Button>
                            <Button
                                variant={type === "time" ? ButtonVariants.Primary : ButtonVariants.Light}
                                className='tw-justify-center'
                                onClick={() => setType("time")}
                            >
                                <span>Time</span>
                            </Button>
                        </ButtonGroup>
                    </div>
                    <div className="k-datetime-selector">
                        {
                            type === "date"
                                ? <div className="k-datetime-calendar-wrap">
                                    <div className="tw-flex tw-flex-col tw-gap-3">
                                        <Calendar
                                            navigation={false}
                                            min={props.min}
                                            value={normalize(model.date)}
                                            onChange={(e) => setModel({ ...model, date: e.value?.toISOString() })}
                                        />
                                        <div className='tw-flex tw-flex-row tw-gap-3 tw-mx-8 tw-items-center'>
                                            <RadioButton
                                                id='dateRange.exact'
                                                name='rangeQualifier'
                                                label='Exact day'
                                                value=''
                                                isChecked={model?.rangeQualifier === undefined || model?.rangeQualifier === ""}
                                                onChange={() => setModel({ ...model, rangeQualifier: "" })}
                                            />
                                            <RadioButton
                                                id='dateRange.vary'
                                                name='rangeQualifier'
                                                label='± 1 day'
                                                value='C'
                                                isChecked={model?.rangeQualifier === "C"}
                                                onChange={() => setModel({ ...model, rangeQualifier: "C" })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                : <div className="k-datetime-time-wrap">
                                    <TimePart
                                        value={normalize(model.time)}
                                        onChange={(e?: Date) => setModel({ ...model, time: e?.toISOString() })}
                                        onNowClick={() => setModel({ ...model, time: new Date().toISOString() })}
                                    />
                                </div>
                        }
                    </div>
                    <div className="k-datetime-footer k-actions k-actions-stretched">
                        <Button
                            variant={ButtonVariants.Light} className='tw-justify-center'
                            onClick={props.onCancel}
                        >
                            <span>Cancel</span>
                        </Button>
                        <Button
                            variant={ButtonVariants.Primary}
                            className='tw-justify-center'
                            onClick={() => props.onSubmit?.({ ...model })}
                        >
                            <span>Done</span>
                        </Button>
                    </div>
                </div>
            </div>
        </Popup>
    );
}


interface FlightDateTimePickerProps {
    id?: string;
    name?: string;
    className?: string;
    format?: string;
    min?: string;
    max?: string;
    value?: RequestedArrivalDepartureType;
    onChange?: (value?: RequestedArrivalDepartureType) => void;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    onFocus?: () => void;
    onBlur?: () => void;
}

function FlightDateTimePicker({ min, value, onChange }: FlightDateTimePickerProps) {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const handleSetClicked = (e?: RequestedArrivalDepartureType) => {
        console.log('Set clicked', e);

        if (onChange) {
            onChange(e);
        }

        setIsPopupOpen(false);
    };

    return (
        <DateTimePicker
            dateInput={(props) => <FlightDateTimePickerInput
                {...props}
                min={normalize(min)}
                selection={value}
                onClick={() => setIsPopupOpen(true)} />}
            popup={(props) =>
                <FlightDateTimePickerPopup
                    {...props}
                    show={isPopupOpen}
                    min={normalize(min)}
                    value={value}
                    onCancel={() => setIsPopupOpen(false)}
                    onSubmit={handleSetClicked}
                />
            }
            value={normalize(value?.date)}
        />
    );


}

export default FlightDateTimePicker;