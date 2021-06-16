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
    [Authorize]
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
                .Where(t=> t.UserId.ToString() == User.Identity.Name)
                .ToListAsync();
            
            return Ok(_mapper.Map<IEnumerable<Text>, IEnumerable<TextResponse>>(texts));
        }

        // GET: api/Text/5
        [HttpGet("{id}")]
        public async Task<ActionResult<FullTextResponse>> GetText(int id)
        {
            if (User.Identity == null)
            {
                return BadRequest();
            }

            var text = await _context.Texts
                .Where(t=> 
                    t.UserId.ToString() == User.Identity.Name && 
                           t.Id == id).FirstOrDefaultAsync();

            if (text == null)
            {
                return NotFound();
            }

            var fullText =  _mapper.Map<Text, FullTextResponse>(text);
            fullText.Text = await GetTextFile(text.StorageLink);
            return fullText;
        }
        
        
        private async Task<string> GetTextFile(string storageLink)
        {
            GoogleStorageService service = new GoogleStorageService();
            var file = await service.ReadStr(storageLink);

            return file;
        }

        // PUT: api/Text/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutText(int id, FullTextRequest textRequest)
        {
            if (id != textRequest.Id)
            {
                return BadRequest();
            }
            
            if (User.Identity == null)
            {
                return BadRequest();
            }

            var text = await _context.Texts.Where(t=>t.UserId.ToString()==User.Identity.Name && t.Id == id).FirstOrDefaultAsync();
            if (text == null)
                return BadRequest();
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

            await PostTextFile(textRequest.Text, text.StorageLink);
            return NoContent();
        }

        // POST: api/Text
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<TextResponse>> PostText(FullTextRequest textRequest)
        {
            if (User.Identity == null)
            {
                return BadRequest();
            }
            
            var text = _mapper.Map<FullTextRequest, Text>(textRequest);
            text.UserId = Convert.ToInt32(User.Identity.Name);
            text.StorageLink = text.UserId + '/' + text.Name;
            text.LastUpdated = DateTime.Now;
            
            _context.Texts.Add(text);
            await _context.SaveChangesAsync();
            await PostTextFile(textRequest.Text, text.StorageLink);
            
            return CreatedAtAction("GetText", new { id = text.Id }, text);
        }
        
        private async Task<ActionResult> PostTextFile(string content, string filename)
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
