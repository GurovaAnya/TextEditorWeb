using Newtonsoft.Json;
using TextEditorWeb.Models;

namespace TextEditorWeb.Contracts
{
    public class AuthenticateResponse
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string Name { get; set; }
        public string Login { get; set; }
        public string JwtToken { get; set; }

        [JsonIgnore] // refresh token is returned in http only cookie
        public string RefreshToken { get; set; }

        public AuthenticateResponse(Editor editor, string jwtToken, string refreshToken)
        {
            Id = editor.Id;
            Name = editor.Name;
            Login = editor.Login;
            JwtToken = jwtToken;
            RefreshToken = refreshToken;
        }
    }
}