using System.Collections.Generic;
using TextEditorWeb.Contracts;
using TextEditorWeb.Models;

namespace TextEditorWeb.Services
{
    public interface IUserService
    {
        AuthenticateResponse Authenticate(AuthenticateRequest model, string ipAddress);
        
        AuthenticateResponse Register(Editor editor, string ipAddress);
        AuthenticateResponse RefreshToken(string token, string ipAddress);
        bool RevokeToken(string token, string ipAddress);
        IEnumerable<Editor> GetAll();
        Editor GetById(int id);
    }
}