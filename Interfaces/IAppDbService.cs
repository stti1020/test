namespace Flottenmanagement_WebApp.Interfaces
{
    public interface IAppDbService
    {
        IGeopositionDbService GeopositionDbService { get; }
        IObdLogDbService ObdLogDbService { get; }
        IObdCommandDbService ObdCommandDbService { get; }
    }
}
