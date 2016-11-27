using System.Collections.Generic;
using Flottenmanagement_WebApp.Models;

namespace Flottenmanagement_WebApp.Interfaces
{
    public interface IObdLogDbService
    {
        List<ObdLog> GetLatestObdLogsByRegistrationNumbers(string registrationNumber);

        List <ObdLog> GetAllLatestObdLogs();

        List<ObdLog> GetSimulationObdLogsByRegistrationNumber(string registrationNumber);
    }
}
