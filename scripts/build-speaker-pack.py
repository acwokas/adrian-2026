from pathlib import Path
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle, Image, KeepTogether
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from pypdf import PdfReader
root=Path(__file__).resolve().parents[1]
out=root/'public/documents'
navy='#143344'; muted='#536370'; gold='#B88845'
styles={
'body':ParagraphStyle('body',fontName='Helvetica',fontSize=10,leading=14,textColor=colors.HexColor(navy),spaceAfter=8),
'small':ParagraphStyle('small',fontName='Helvetica',fontSize=9,leading=12,textColor=colors.HexColor(muted),spaceAfter=6),
'h':ParagraphStyle('h',fontName='Helvetica-Bold',fontSize=14,leading=18,textColor=colors.HexColor(navy),spaceBefore=12,spaceAfter=7,keepWithNext=True),
'big':ParagraphStyle('big',fontName='Times-Roman',fontSize=32,leading=35,textColor=colors.HexColor(navy),spaceAfter=12),
'k':ParagraphStyle('k',fontName='Helvetica-Bold',fontSize=9,leading=12,textColor=colors.HexColor(gold),spaceAfter=12),
}
def p(t,s='body'):return Paragraph(t,styles[s])
def link(url,label):return f'<a href="{url}" color="{navy}"><u>{label}</u></a>'
story=[p('SPEAKING, WORKSHOPS AND MODERATION','k')]
portrait=Image(str(root/'public/images/hero-portrait.jpg'),width=90,height=112,kind='proportional')
hero=Table([[[p('Adrian Watkins','big'),p('Operator. Builder. Governor.'),p('Commercial and operating leadership.<br/>Business and AI transformation.'),p('Based in Singapore. Working across markets.','small')],portrait]],colWidths=[400,105])
hero.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),0),('RIGHTPADDING',(0,0),(-1,-1),0)]))
story += [hero,p('Short introduction','h'),p('Adrian Watkins builds and leads technology businesses, connecting commercial strategy, day-to-day operations and governance to make business and AI transformation work in practice. Based in Singapore, he brings more than 25 years of experience across Asia, Europe and the US. He is the creator of the EDGE Framework.'),p('Biography for organisers','h'),p('Adrian leads commercial operations and governance at SQREEM Technologies, alongside his responsibilities as Data Protection Officer. His experience spans business growth, acquisition integration, partnerships and international expansion, with attention to local commercial, regulatory and cultural realities.'),p('He created EDGE to help people turn knowledge, experience and insight into action. Separately from his executive role, he builds publications, data services and practical AI tools through democratising.ai. His speaking, workshops and moderated discussions bring these perspectives into practical questions about how businesses change, make decisions and deliver.'),p('Selected contributions','h')]
for t in [
'<b>SDG Open Hack, NUS | 10 October 2026.</b> Judge for student pitches addressing sustainability challenges.',
'<b>ASEAN Foundation, SOAR Together | 2026.</b> Mentor to businesses in the regional MSME programme, following the September kickoff.',
'<b>SDG Open Hack, Singapore | September 2026.</b> Student mentor at the Social Impact Catalyst and Nanyang Polytechnic editions.',
'<b>Ortus Club | May 2026.</b> Moderator for a closed-door senior executive roundtable on services delivery and AI.',
'<b>National Library Board / BlackStorm Group | 2025 and 2026.</b> Founder workshops at the Launch Entrepreneurship Bootcamp.',
'<b>Smart Living, Sustainable Future, Taipei | November 2025.</b> Opening keynote and startup panel moderation as a guest of Taipei City Government.'
]:story.append(p(t,'small'))
story.append(p(link('https://adrianwatkins.com/speaking','Engagement details')+'  |  '+link('https://adrianwatkins.com/events/sdg-open-hack-nus-2026','NUS reflection and photos')+'  |  '+link('https://adrianwatkins.com/singapore','Singapore and mentoring'),'small'))
story += [p('A mentoring perspective','h'),p("&ldquo;Often voted as 'most requested mentor' Adrian has a natural talent for bringing people together and motivating them to achieve their best.&rdquo;"),p('Selma Ayuanshari | Mentoring programme collaborator | 3 July 2023','small'),p(link('https://www.linkedin.com/in/adrianwatkins/details/recommendations/','Read the original LinkedIn recommendation'),'small')]
story += [PageBreak(),p('CONVERSATIONS AND PRACTICAL SESSIONS','k'),p('Useful questions.<br/>Practical next steps.','big')]
def session(title,audience,body,takeaway):
 return KeepTogether([p(title,'h'),p(audience,'small'),p(body),p('<b>Takeaway:</b> '+takeaway)])
story += [session('Making business and AI transformation work in practice','For leadership and operating teams.','Where should AI change the work, and what else needs to change with it? Explore workflows, ownership, incentives and the evidence needed to judge whether an initiative is helping.','A way to define the business outcome, the operating changes and the evidence to review before scaling.'),session('Growth after the deal','For founders and commercial and operating leaders.','An acquisition creates choices about customers, teams, systems and accountability. Discuss where common rules help and where local teams need room to act.','A practical set of integration questions, with clear owners and priorities.'),session('Governance that helps teams act','For executives and teams working across markets.','Use EDGE to connect a clear outcome with decision rights, exceptions and review triggers. Governance should help people act confidently, with human judgement and accountability built in.','A decision map: who owns it, what needs checking and when to revisit it.')]
story += [p('For student and founder programmes','h'),p('<b>From an idea to a useful service.</b> Identify an audience, clarify the value of an idea and design a practical first test. Suitable for guest sessions, workshops and mentoring.'),p('Plan the session','h'),p('Suggested starting points: a 30-minute talk with discussion, or a 60-minute working session. Panels and executive roundtables are shaped around the brief. Durations, scope and availability are agreed with the organiser.','small'),p('Please share the audience, desired outcome, date, location or online format, and any recording requirements. For a workshop, include a business question or case the group can use, with confidential information removed.','small'),p('Suitable pro bono student and education opportunities are welcome, agreed case by case alongside Adrian\'s executive responsibilities.','small'),p(link('https://adrianwatkins.com/images/hero-portrait.jpg','Download headshot')+'  |  '+link('https://adrianwatkins.com/edge','Explore EDGE')+'  |  '+link('mailto:me@adrianwatkins.com','me@adrianwatkins.com'),'small')]
def footer(c,d):
 c.setStrokeColor(colors.HexColor('#CCD3D5'));c.line(42,39,553,39)
 c.setFillColor(colors.HexColor(muted));c.setFont('Helvetica',8)
 c.drawString(42,25,'adrianwatkins.com/speaking');c.linkURL('https://adrianwatkins.com/speaking',(42,22,200,34))
 c.drawRightString(553,25,f'{d.page}/2')
pdf=out/'Adrian-Watkins-Speaking-Workshops-and-Moderation.pdf'
SimpleDocTemplate(str(pdf),pagesize=A4,leftMargin=42,rightMargin=42,topMargin=36,bottomMargin=53,title='Adrian Watkins | Speaking, workshops and moderation',author='Adrian Watkins').build(story,onFirstPage=footer,onLaterPages=footer)
r=PdfReader(pdf);assert len(r.pages)==2, len(r.pages)
assert '\u2014' not in ''.join(pg.extract_text() for pg in r.pages)
(out/'Adrian-Watkins-Speaker-and-Guest-Teaching-Pack.pdf').write_bytes(pdf.read_bytes())
print(pdf)
