using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TextEditorWeb.Contracts;
using TextEditorWeb.Models;
using TextEditorWeb.Services;

namespace TextEditorWeb.Controllers
{
    //[Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class TextController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public TextController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Text
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TextResponse>>> GetTexts()
        {
            if (User.Identity == null)
            {
                return BadRequest();
            }

            var texts = await _context.Texts
                //.Where(t=> t.UserId.ToString() == User.Identity.Name)
                .ToListAsync();
            
            return Ok(_mapper.Map<IEnumerable<Text>, IEnumerable<TextResponse>>(texts));
        }

        // GET: api/Text/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TextResponse>> GetText(int id)
        {
            if (User.Identity == null)
            {
                return BadRequest();
            }

            var text = await _context.Texts
                .Where(t=> 
                    //t.UserId.ToString() == User.Identity.Name && 
                           t.Id == id).FirstOrDefaultAsync();

            if (text == null)
            {
                return NotFound();
            }

            return _mapper.Map<Text, TextResponse>(text);
        }
        
        // GET: api/Text/5/File
        [HttpGet("{id}/File")]
        public async Task<IActionResult> GetTextFile(int id)
        {
            var text = await _context.Texts.FindAsync(id);

            if (text == null)
            {
                return NotFound();
            }
            
            GoogleStorageService service = new GoogleStorageService();
            var fileBytes = await service.Read(text.StorageLink);

            return File(fileBytes, "multipart/form-data");
        }

        // PUT: api/Text/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutText(int id, TextRequest textRequest)
        {
            if (id != textRequest.Id)
            {
                return BadRequest();
            }

            var text = await _context.Texts.FindAsync(id);
            text.Name = textRequest.Name;
            text.LastUpdated = DateTime.Now;

            _context.Entry(text).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TextExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Text
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<TextResponse>> PostText(TextRequest textRequest)
        {
            var text = _mapper.Map<TextRequest, Text>(textRequest);
            text.StorageLink = text.UserId + '/' + text.Name;
            text.LastUpdated = DateTime.Now;
            
            _context.Texts.Add(text);
            await _context.SaveChangesAsync();
            
            return CreatedAtAction("GetText", new { id = text.Id }, text);
        }
        
        // POST: api/Text/File
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("File")]
        public async Task<ActionResult> PostTextFile([FromForm(Name = "File")]IFormFile content, [FromHeader(Name = "Filename")]string filename)
        {
            var service = new GoogleStorageService();
            await service.Write(content, filename);
            return Ok();
        }

        // DELETE: api/Text/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteText(int id)
        {
            var text = await _context.Texts.FindAsync(id);
            if (text == null)
            {
                return NotFound();
            }

            _context.Texts.Remove(text);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TextExists(int id)
        {
            return _context.Texts.Any(e => e.Id == id);
        }
    }
}
