using System.Collections.Generic;
using System.Linq;
using Flottenmanagement_WebApp.Interfaces;
using Flottenmanagement_WebApp.Models;

namespace Flottenmanagement_WebApp.Services
{
    public class ObdCommandDbService : IObdCommandDbService
    {
        internal AppDbService AppDbService;

        internal ObdCommandDbService(AppDbService appdbService)
        {
            AppDbService = appdbService;
        }

        /// <summary>Holt die letzte Echtzeitdaten der geünschten Fahrzeuge</summary>
        /// <returns>Liste von Echtzeitdaten der gewünschten Fahrzeuge</returns>
        public List<ObdCommand> GetAllObdCommands()
        {
            return AppDbService.Context.ObdCommand.ToList();
        }
    }
}
