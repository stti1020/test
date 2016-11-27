using System.Collections.Generic;
using Flottenmanagement_WebApp.Models;

namespace Flottenmanagement_WebApp.Interfaces
{
    public interface IMapService
    {
        List<RealTimeData> MergeData(List<Geoposition> geopositions, List<ObdLog> realTimeData,
            List<ObdCommand> obdCommands);

        List<RealTimeData> MergeGeopositionsWithObdLog(List<Geoposition> geopositions, List<ObdLog> obdLogs,
            List<ObdCommand> obdCommands);

        string ConvertResult(string result, string command);
    }
}
