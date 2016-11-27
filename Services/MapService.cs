using System.Collections.Generic;
using Flottenmanagement_WebApp.Interfaces;
using Flottenmanagement_WebApp.Models;

namespace Flottenmanagement_WebApp.Services
{
    public class MapService : IMapService
    {
        public List<RealTimeData> MergeData(List<Geoposition> geopositions, List<ObdLog> realTimeDatas, List<ObdCommand> obdCommands)
        {
            List<RealTimeData> realTimeDataResultList = new List<RealTimeData>();

            RealTimeData realTimeDataToAdd = null;

            ObdProperty currentObdData = null;

            var hasBeenAddedAsProperty = false;

            foreach(Geoposition geoposition in geopositions)
            {
                foreach(ObdLog realTimeData in realTimeDatas)
                {
                    if (geoposition.registrationNumber.Equals(realTimeData.registrationNumber))
                    {
                        foreach(ObdCommand obdCommand in obdCommands)
                        {
                            if (obdCommand.command == realTimeData.command)
                            {
                                currentObdData = new ObdProperty(realTimeData.command, obdCommand.property, realTimeData.result, obdCommand.unit);
                            }
                        }

                        if (!realTimeData.result.Equals("INVALID"))
                        {
                            switch (realTimeData.command)
                            {
                                case "010C":
                                    realTimeData.result = realTimeData.result.Remove(0, 4);
                                    currentObdData.result =
                                        (int.Parse(realTimeData.result, System.Globalization.NumberStyles.HexNumber) / 4).ToString();
                                    break;

                                case "010D":
                                    realTimeData.result = realTimeData.result.Remove(0, 4);
                                    currentObdData.result =
                                        int.Parse(realTimeData.result, System.Globalization.NumberStyles.HexNumber).ToString();
                                    break;

                                default:
                                    break;
                            }
                        }

                        if (realTimeDataResultList.Count == 0)
                        {
                            realTimeDataToAdd = new RealTimeData(geoposition);
                            realTimeDataToAdd.ObdPropertyList = new List<ObdProperty>();
                            realTimeDataToAdd.ObdPropertyList.Add(currentObdData);
                            realTimeDataResultList.Add(realTimeDataToAdd);
                        }
                        else
                        {
                            foreach(RealTimeData realTimeDataResult in realTimeDataResultList)
                            {
                                if (realTimeDataResult.RegistrationNumber.Equals(realTimeData.registrationNumber))
                                {
                                    realTimeDataResult.ObdPropertyList.Add(currentObdData);
                                    hasBeenAddedAsProperty = true;
                                }
                            }

                            if (hasBeenAddedAsProperty == false)
                            {
                                realTimeDataToAdd = new RealTimeData(geoposition);
                                realTimeDataToAdd.ObdPropertyList = new List<ObdProperty>();
                                realTimeDataToAdd.ObdPropertyList.Add(currentObdData);
                                realTimeDataResultList.Add(realTimeDataToAdd);
                            }

                            hasBeenAddedAsProperty = false;
                        }
                    }
                }
            }

            return realTimeDataResultList;
        }

        public string ConvertResult(string result, string command)
        {
            if (!result.Equals("INVALID"))
            {
                switch (command)
                {
                    case "010C":
                        result = result.Remove(0, 4);
                        result =
                            (int.Parse(result, System.Globalization.NumberStyles.HexNumber)/4).ToString();
                        break;

                    case "010D":
                        result = result.Remove(0, 4);
                        result =
                            int.Parse(result, System.Globalization.NumberStyles.HexNumber).ToString();
                        break;
                }
            }
            return result;
        }

        public List<RealTimeData> MergeGeopositionsWithObdLog(List<Geoposition> geopositions, List<ObdLog> obdLogs,
            List<ObdCommand> obdCommands)
        {
            List<RealTimeData> realTimeData = new List<RealTimeData>();
            List<int> index = new List<int>();
            List<ObdProperty> obdProperties = new List<ObdProperty>();

            foreach (Geoposition g in geopositions)
            {
                index.Add(obdLogs.FindIndex(o => (g.__createdAt - o.__createdAt).TotalSeconds < 15 && o.command == "010C"));
                index.Add(obdLogs.FindIndex(o => (g.__createdAt - o.__createdAt).TotalSeconds < 15 && o.command == "010D"));


                if (index.Count == 2 && index[0] != -1 && index[1] != -1)
                {

                    var o1 = obdLogs[index[0]];
                    var o2 = obdLogs[index[1]];
                    foreach (ObdCommand command in obdCommands)
                    {
                        if (command.command == o1.command)
                        {

                            obdProperties.Add(new ObdProperty(o1.command, command.property, ConvertResult(o1.result, command.command), command.unit));
                        }
                        if (command.command == o2.command)
                        {
                            obdProperties.Add(new ObdProperty(o2.command, command.property, ConvertResult(o2.result, command.command), command.unit));
                        }
                    }
                    realTimeData.Add(new RealTimeData(g, obdProperties));
                    obdLogs.Remove(obdLogs.Find(o =>o.result == o1.result && o.__createdAt == o1.__createdAt &&o.registrationNumber == o1.registrationNumber && o.command == o1.command));
                    obdLogs.Remove(obdLogs.Find(o => o.result == o2.result && o.__createdAt == o2.__createdAt && o.registrationNumber == o2.registrationNumber && o.command == o2.command));
                }
            }
            return realTimeData;
        }
    }
}
