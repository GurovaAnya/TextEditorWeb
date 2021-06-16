using AutoMapper;
using TextEditorWeb.Contracts;
using TextEditorWeb.Models;

namespace TextEditorWeb.Utils
{
    public class AutoMappingProfile : Profile
    {
        public AutoMappingProfile()
        {
            CreateMap<Text, TextResponse>();
            CreateMap<TextRequest, Text>();
        }
    }
}