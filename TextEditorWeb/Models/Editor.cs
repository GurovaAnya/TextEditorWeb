using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using TextEditorWeb.Models;

namespace TextEditorWeb.Models
{
    [Table("users")]
    public class Editor
    {
        public const string Role = "Editor";

        [Key]
        public int Id { get; set; }
        public string Login { get; set; }
        public string Password { get; set; }
        public string Name { get; set; }
        public virtual List<RefreshToken> RefreshTokens { get; set; }
    }
}