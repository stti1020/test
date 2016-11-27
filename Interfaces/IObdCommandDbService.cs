using System.Collections.Generic;
using Flottenmanagement_WebApp.Models;

namespace Flottenmanagement_WebApp.Interfaces
{
    public interface IObdCommandDbService
    {
        List <ObdCommand> GetAllObdCommands();
    }
}
