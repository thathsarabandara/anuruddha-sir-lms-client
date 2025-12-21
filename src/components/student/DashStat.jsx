const DashStat = ({ title, value, icon: Icon, colorClass, subtext }) => {
    return (
        <div
            className={`${colorClass} rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all duration-300`}
        >
            <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-2">{title}</p>
                  <p className="text-3xl font-bold text-slate-900">{value}</p>
                  <p className="text-xs text-slate-600 mt-2">{subtext}</p>
                </div>
                {Icon && <Icon className="text-2xl text-slate-400" />}
            </div>
        </div>
    );
}

export default DashStat;