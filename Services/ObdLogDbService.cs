using System.Collections.Generic;
using System.Linq;
using Flottenmanagement_WebApp.Interfaces;
using Flottenmanagement_WebApp.Models;
using Newtonsoft.Json;

namespace Flottenmanagement_WebApp.Services
{
    public class ObdLogDbService : IObdLogDbService
    {
        internal AppDbService AppDbService;

        internal ObdLogDbService(AppDbService appdbService)
        {
            AppDbService = appdbService;
        }

        /// <summary>Holt die letzte Echtzeitdaten der geünschten Fahrzeuge</summary>
        /// <param name="registrationNumbers">Jsonobjekt, das die Kennzeichen der gewünschten Fahrzeuge enthält</param>
        /// <returns>Liste von Echtzeitdaten der gewünschten Fahrzeuge</returns>
        public List<ObdLog> GetLatestObdLogsByRegistrationNumbers(string registrationNumbers)
        {
            var regNumbers = JsonConvert.DeserializeObject<List<string>>(registrationNumbers);
            return AppDbService.Context.ObdLog.Where(g => regNumbers.Contains(g.registrationNumber))
                                              .GroupBy(g => new { g.registrationNumber, g.command })
                                              .Select(s => s.OrderByDescending(g => g.__createdAt)
                                                            .FirstOrDefault())
                                              .ToList();
        }

        /// <summary>Holt die letzte Echtzeitdaten der geünschten Fahrzeuge</summary>
        /// <returns>Liste von Echtzeitdaten der gewünschten Fahrzeuge</returns>
        public List<ObdLog> GetAllLatestObdLogs()
        {
            return AppDbService.Context.ObdLog.GroupBy(g => new { g.registrationNumber, g.command})
                                              .Select(s => s.OrderByDescending(g => g.__createdAt)
                                                            .FirstOrDefault())
                                              .ToList();
        }

        /// <summary>Holt die letzten Echtzeitdaten des gewünschten Fahrzeuges</summary>
        /// <param name="registrationNumbers">Enthält ein Kennzeichen</param>
        /// <returns>Liste von Echtzeitdaten des gewünschten Fahrzeuges</returns>
        public List<ObdLog> GetSimulationObdLogsByRegistrationNumber(string registrationNumber)
        {
            return
                AppDbService.Context.ObdLog.Where(o => o.registrationNumber == registrationNumber)
                                           .OrderByDescending(o => o.__createdAt)
                                           .Take(150)
                                           .ToList();
        }
    }
}
