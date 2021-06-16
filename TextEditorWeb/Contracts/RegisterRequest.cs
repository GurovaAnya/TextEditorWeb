using System.ComponentModel.DataAnnotations;

namespace TextEditorWeb.Contracts
{
    public class RegisterRequest
    {
        [Required]
        public string Login { get; set; }

        [Required]
        public string Password { get; set; }
        
        public string Name { get; set; }
    }
}