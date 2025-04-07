/** @format */

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Reusable Components
const DateRangePicker = ({ startDate, endDate, updateTripField }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Start Date
      </label>
      <DatePicker
        selected={startDate ? new Date(startDate) : null}
        onChange={(date) =>
          updateTripField(
            "startDate",
            date ? date.toISOString().split("T")[0] : ""
          )
        }
        dateFormat="yyyy-MM-dd"
        placeholderText="Select Start Date"
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#2E4A47]"
        minDate={new Date()}
        maxDate={endDate ? new Date(endDate) : null}
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        End Date
      </label>
      <DatePicker
        selected={endDate ? new Date(endDate) : null}
        onChange={(date) =>
          updateTripField(
            "endDate",
            date ? date.toISOString().split("T")[0] : ""
          )
        }
        dateFormat="yyyy-MM-dd"
        placeholderText="Select End Date"
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#2E4A47]"
        minDate={startDate ? new Date(startDate) : new Date()}
      />
    </div>
  </div>
);

export default DateRangePicker;
