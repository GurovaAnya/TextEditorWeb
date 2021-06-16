using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TextEditorWeb.Models
{
    public class Text
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        [Column("user_id")]
        public int UserId { get; set; }
        [Column("last_updated")]
        public DateTime LastUpdated { get; set; }
        [Column("storage_link")]
        public string StorageLink { get; set; }
        
        [ForeignKey(nameof(UserId))]
        public virtual Editor Editor { get; set; }
    }
}