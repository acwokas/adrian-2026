#!/usr/bin/env python3
"""Build the executive CV from its reviewed, page-structured text source."""
from pathlib import Path
import re
from html import escape
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
root=Path(__file__).resolve().parents[1]
text=(root/'docs/executive-cv.txt').read_text()
styles=getSampleStyleSheet()
styles.add(ParagraphStyle(name='CVBody',fontName='Helvetica',fontSize=9.3,leading=11.5,spaceAfter=5,textColor=colors.HexColor('#253746')))
styles.add(ParagraphStyle(name='CVBullet',parent=styles['CVBody'],leftIndent=10,firstLineIndent=-8,spaceAfter=5))
styles.add(ParagraphStyle(name='CVHeading',fontName='Helvetica-Bold',fontSize=11.2,leading=14,spaceBefore=8,spaceAfter=5,textColor=colors.HexColor('#143344'),keepWithNext=True))
styles.add(ParagraphStyle(name='CVRole',parent=styles['CVBody'],fontName='Helvetica-Oblique',fontSize=9,spaceAfter=7,keepWithNext=True))
story=[]
for i,page in enumerate(text.split('\f')):

 for para in page.strip().split('\n\n'):
  para=para.strip()
  if not para or para == '## Professional experience continued':continue
  if para=='Adrian Watkins':
   story.append(Paragraph(para,ParagraphStyle(name='Name',fontName='Helvetica-Bold',fontSize=25,leading=30,spaceAfter=9,textColor=colors.HexColor('#143344'))));continue
  st='CVBody'
  if para.startswith('• '):st='CVBullet'
  elif para.startswith('## '):st='CVHeading';para=para[3:]
  elif ' | ' in para and not para.startswith('Singapore'):st='CVRole'
  story.append(Paragraph(escape(para).replace('\n','<br/>'),styles[st]))
def footer(c,d):
 c.setStrokeColor(colors.HexColor('#c4cbd0'));c.line(42,39,A4[0]-42,39)
 c.setFont('Helvetica',8);c.setFillColor(colors.HexColor('#536370'))
 c.drawString(42,26,'me@adrianwatkins.com | +65 8161 7961 | adrianwatkins.com')
 c.drawRightString(A4[0]-42,26,f'{d.page}')
 c.linkURL('https://adrianwatkins.com',(42,21,410,35),relative=0)
out=root/'public/documents/Adrian-Watkins-Executive-CV-2027.pdf'
SimpleDocTemplate(str(out),pagesize=A4,rightMargin=42,leftMargin=42,topMargin=36,bottomMargin=51,title='Adrian Watkins | Executive CV',author='Adrian Watkins').build(story,onFirstPage=footer,onLaterPages=footer)
(root/'public/documents/AdrianWatkins_Executive-CV.pdf').write_bytes(out.read_bytes())
print(out)
