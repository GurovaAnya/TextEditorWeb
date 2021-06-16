using System;

namespace TextEditorWeb.Contracts
{
    public class FullTextResponse
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int UserId { get; set; }
        public DateTime LastUpdated { get; set; }
        public string Text { get; set; }
    }
}