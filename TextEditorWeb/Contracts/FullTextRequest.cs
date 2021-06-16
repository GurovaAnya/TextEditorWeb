namespace TextEditorWeb.Contracts
{
    public class FullTextRequest
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int UserId { get; set; }
        public string Text { get; set; }
    }
}