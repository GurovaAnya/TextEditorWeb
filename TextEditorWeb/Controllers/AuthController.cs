using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using TextEditorWeb.Models;
using TextEditorWeb.Utils;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using TextEditorWeb.Contracts;

namespace TextEditorWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public AuthController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        
        [HttpPost("token")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Token(AuthenticateRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x =>  x.Login == request.Login && x.Password == request.Password);
            var identity = GetIdentity(user);
            if (identity == null)
            {
                return BadRequest(new { errorText = "Invalid username or code." });
            }
 
            var now = DateTime.UtcNow;
            // создаем JWT-токен
            var jwt = new JwtSecurityToken(
                issuer: AuthOptions.ISSUER,
                audience: AuthOptions.AUDIENCE,
                notBefore: now,
                claims: identity.Claims,
                expires: now.Add(TimeSpan.FromMinutes(AuthOptions.LIFETIME)),
                signingCredentials: new SigningCredentials(AuthOptions.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256));
            var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);
 
            
            
            var client = await _context.Users.Where(c => c.Login == request.Login).FirstOrDefaultAsync();
            
            var response = new
             {
                 access_token = encodedJwt,
                 username = identity.Name,
                 user_id = client.Id
             };
            return Ok(response);
        }
        
        private ClaimsIdentity GetIdentity(Editor user)
        {
            if (user == null) return null;
            var claims = new List<Claim>
            {
                new Claim(ClaimsIdentity.DefaultNameClaimType, user.Login),
                new Claim(ClaimsIdentity.DefaultRoleClaimType, Models.Editor.Role),
            };
            ClaimsIdentity claimsIdentity =
                new ClaimsIdentity(claims, "Token", ClaimsIdentity.DefaultNameClaimType,
                    ClaimsIdentity.DefaultRoleClaimType);
            return claimsIdentity;
        }
        
        
   
        [HttpPost("register")]
        public async Task<IActionResult> RegisterClient(RegisterRequest request)
        {
            Editor editor;
            try
            {
                editor = new Editor()
                {
                    Login = request.Login,
                    Password = request.Password,
                    Name = request.Name
                };

                _context.Users.Add(editor);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException exception)
            {
                return Conflict("Клиент с таким логином уже существует");
            }

            var identity = GetIdentity(editor);
            
            var now = DateTime.UtcNow;
            // создаем JWT-токен
            var jwt = new JwtSecurityToken(
                issuer: AuthOptions.ISSUER,
                audience: AuthOptions.AUDIENCE,
                notBefore: now,
                claims: identity.Claims,
                expires: now.Add(TimeSpan.FromMinutes(AuthOptions.LIFETIME)),
                signingCredentials: new SigningCredentials(AuthOptions.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256));
            var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);
            
            var response = new
             {
                 access_token = encodedJwt,
                 username = identity.Name,
                 user_id = editor.Id
             };
            return Ok(response);
        }
    }
}