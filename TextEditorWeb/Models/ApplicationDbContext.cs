using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Internal;

namespace TextEditorWeb.Models
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions dbContextOptions) : base(dbContextOptions)
        {}
        
        public DbSet<Editor> Users { get; set; }
        public DbSet<Text> Texts { get; set; }

        public DbSet<RefreshToken> RefreshTokens { get; set; }
    }
}