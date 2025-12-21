import { FaBook, FaLeaf, FaQuestion, FaRulerCombined } from "react-icons/fa";
import { MdAccessTimeFilled, MdOutlineLanguage } from "react-icons/md";
import { RiEnglishInput } from "react-icons/ri";
import React from "react";
import { FaCalendarDays } from "react-icons/fa6";
import { BsFillStopwatchFill } from "react-icons/bs";

const QuizCard = ({ subject,title,difficulty,date,time,questions,duration }) => {
    const gessIcon = (subject) => {
        switch(subject) {
            case 'Mathematics':
                return FaRulerCombined;
            case 'Sinhala':
                return FaBook;
            case 'English':
                return RiEnglishInput;
            case 'Environment':
                return FaLeaf;
            case 'Tamil':
                return MdOutlineLanguage;
            default:
                return FaBook;
        }
    }
    return(
        <div
            className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all overflow-hidden group"
        >
            {/* Quiz Header with Subject Color */}
            <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>

                {/* Quiz Content */}
                <div className="p-5">
                  {/* Subject & Icon */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{React.createElement(gessIcon(subject))}</span>
                    <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      {difficulty}
                    </span>
                </div>

                {/* Quiz Title */}
                <h3 className="text-sm font-bold text-slate-900 mb-1 line-clamp-2 h-14 overflow-hidden">{title}</h3>
                <p className="text-xs text-slate-500 mb-3">{subject}</p>

                {/* Quiz Details */}
                <div className="space-y-2 text-xs text-slate-600 mb-4 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="flex justify-center items-center gap-1"><FaCalendarDays /> {date}</span>
                      <span className="font-semibold flex justify-center items-center gap-1"><MdAccessTimeFilled /> {time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex justify-center items-center gap-1"><FaQuestion /> {questions} Q</span>
                      <span className="flex justify-center items-center gap-1"><BsFillStopwatchFill /> {duration} min</span>
                    </div>
                </div>

                  {/* Attempt Button */}
                <button className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-xs font-bold rounded-lg transition-all">
                    Attempt Now
                </button>
            </div>
        </div>
    )
}

export default QuizCard;