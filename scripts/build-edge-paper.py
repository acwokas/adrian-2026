from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, white
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph
from reportlab.lib.enums import TA_LEFT
from pathlib import Path
from pypdf import PdfReader
import shutil
import xml.etree.ElementTree as ET
ROOT=Path(__file__).resolve().parents[1]
logo_root=ET.parse(ROOT/'public/brand/edge-mark-on-navy.svg').getroot()
OUT=ROOT/'public/documents/EDGE-Framework-Whitepaper.pdf'
W,H=595.28,841.89
navy=HexColor('#14264C'); cream=HexColor('#F7F3EA'); copper=HexColor('#B6753F'); ink=HexColor('#232C37'); grey=HexColor('#52606D')
c=canvas.Canvas(str(OUT),pagesize=(W,H));c.setTitle('The EDGE Framework | A practical guide to decisions and execution');c.setAuthor('Adrian Watkins');c.setSubject('Evaluate, Define, Govern and Elevate');c.setKeywords('EDGE, Adrian Watkins, business decisions, execution, governance')
styles={
 'body':ParagraphStyle('body',fontName='Helvetica',fontSize=11,leading=16,textColor=ink,spaceAfter=10),
 'small':ParagraphStyle('small',fontName='Helvetica',fontSize=9,leading=13,textColor=grey),
 'lead':ParagraphStyle('lead',fontName='Times-Roman',fontSize=18,leading=24,textColor=navy),
 'head':ParagraphStyle('head',fontName='Helvetica-Bold',fontSize=12,leading=16,textColor=navy),
}
page=0;y=0;transcript=[]
def text(t,kind='body',x=48,width=499,gap=12):
 global y
 assert '\u2014' not in t
 p=Paragraph(t,styles[kind]);w,h=p.wrap(width,H);assert y-h>=55,(page,t[:60],y,h);p.drawOn(c,x,y-h);y-=h+gap;transcript.append(t)
def label(t):
 global y
 c.setFont('Helvetica-Bold',9);c.setFillColor(copper);c.drawString(48,y,t.upper());y-=20

def logo(x, yy, size):
 c.setFillColor(navy);c.roundRect(x,yy,size,size,4,fill=1,stroke=0)
 for polygon in logo_root.findall('{http://www.w3.org/2000/svg}polygon'):
  points=[tuple(map(float,p.split(','))) for p in polygon.attrib['points'].split()]
  path=c.beginPath()
  for i,(px,py) in enumerate(points):
   xx=x+px*size/512; Y=yy+(512-py)*size/512
   if i==0:path.moveTo(xx,Y)
   else:path.lineTo(xx,Y)
  path.close();c.setFillColor(HexColor(polygon.attrib['fill']));c.drawPath(path,fill=1,stroke=0)

def new(title,kicker,sub=None):
 global page,y
 if page:c.showPage()
 page+=1;c.setFillColor(cream);c.rect(0,0,W,H,fill=1,stroke=0)
 c.setFillColor(navy);c.rect(0,H-10,W,10,fill=1,stroke=0)
 c.setFillColor(grey);c.setFont('Helvetica',8);c.drawString(48,28,'ADRIAN WATKINS  /  EDGE  /  SEPTEMBER 2026');c.drawRightString(W-48,28,f'{page:02d}')
 c.linkURL('https://adrianwatkins.com/edge',(48,20,340,40),relative=0)
 c.bookmarkPage(f'p{page}');c.addOutlineEntry(title,f'p{page}',0,False)
 logo(483,730,64) if page==1 else logo(519,782,28)
 y=H-54;label(kicker)
 p=Paragraph(title,ParagraphStyle('title',fontName='Times-Bold',fontSize=30,leading=34,textColor=navy));_,h=p.wrap(499,100);p.drawOn(c,48,y-h);y-=h+20
 transcript.append('\n# '+title)
 if sub:text(sub,'lead',gap=20)
def section(h,t):text(h,'head',gap=5);text(t)
def callout(h,t):
 global y
 ps=Paragraph('<b>'+h+'</b><br/>'+t,styles['body']);_,hgt=ps.wrap(467,500);c.setFillColor(HexColor('#E8E4DA'));c.roundRect(48,y-hgt-24,499,hgt+24,4,fill=1,stroke=0);ps.drawOn(c,64,y-hgt-12);y-=hgt+40

def bullets(items):
 for t in items:text('• '+t,gap=7)

new('The EDGE Framework','A practical white paper','Clearer thinking, better decisions<br/>and effective execution')
text('Evaluate. Define. Govern. Elevate.','head',gap=25)
text('A guide for leaders, teams and individuals who need to turn knowledge, experience and insight into action. Use it for a message, a commercial decision, a team priority or a wider business initiative.')
text('Created by Adrian Watkins','head')
text('I created EDGE to bring together the work of understanding a situation, choosing a direction, acting with confidence and learning from what happens. My experience across commercial operations, people, products and governance has shaped the questions in this guide.')
callout('Start with one real decision','By the end of this guide, you should be able to explain your choice, name the person who will act, identify the conditions for proceeding and set a useful review point.')
text('INSIDE','head');text('The method and four pillars  02-06<br/>Two worked illustrations  07-08<br/>Reusable decision worksheet  09<br/>Team use, tools and review  10-12')
text('Practical edition 3.1  |  September 2026<br/><link href="https://adrianwatkins.com/edge" color="#14264C">adrianwatkins.com/edge</link>  •  <link href="https://democratising.ai/tools" color="#14264C">democratising.ai/tools</link>','small')


# Compact sequence diagram makes the cover useful as a quick reference.
for i,(initial,name,verb) in enumerate([('E','Evaluate','Understand'),('D','Define','Choose'),('G','Govern','Enable'),('E','Elevate','Apply and learn')]):
 x=48+i*127
 c.setFillColor(navy);c.roundRect(x,110,118,100,5,fill=1,stroke=0)
 c.setFillColor(copper);c.setFont('Times-Bold',29);c.drawString(x+12,174,initial)
 c.setFillColor(white);c.setFont('Helvetica-Bold',11);c.drawString(x+12,151,name)
 c.setFont('Helvetica',9);c.drawString(x+12,132,verb)
 if i<3:
  c.setStrokeColor(copper);c.setLineWidth(1.4);c.line(x+119,160,x+126,160)
  c.line(x+123,163,x+126,160);c.line(x+123,157,x+126,160)
c.setFillColor(grey);c.setFont('Helvetica',9);c.drawString(48,88,'Carry what you learn into the next stage. Return when the context changes.')

new('One sequence that carries learning forward','02 / The method','Start at Evaluate for a complete decision. Use a single pillar when the immediate need is clear.')
text('EDGE provides a common structure. The depth should match the consequence, uncertainty and reversibility of the decision. A routine message may need a few thoughtful minutes. A market entry or integration may need evidence from several teams.')
for name,desc in [('EVALUATE','Understand the situation. Carry forward evidence, context and the uncertainties that matter.'),('DEFINE','Choose the outcome and direction. Carry forward priorities, an owner and a practical next step.'),('GOVERN','Make decision rights and boundaries clear. Carry forward the conditions for confident execution.'),('ELEVATE','Act, review and improve. Carry forward what worked, what changed and what others can reuse.')]:section(name,desc)
text('You can enter at Govern to clarify an existing approval, or at Define to sharpen a message. Bring the relevant context from earlier stages. If the purpose or evidence is unclear, return to Evaluate rather than filling gaps with assumptions.')
callout('Governance is present throughout','Consider responsibilities and boundaries from the outset. The Govern stage formalises them around the chosen direction. It should help people know what they can do without another meeting.')
text('EDGE organises thinking and action. It does not validate evidence for you or guarantee an outcome. Use relevant professional expertise where the decision requires it.','small')

new('Evaluate','03 / Understand before you act','What decision are we really making, and what do we know?')
text('Begin with the situation rather than a preferred solution. Write the decision as a question that someone can answer. Separate what is observed from what is assumed and what is still unknown.')
section('Work through it','Identify who is affected, who sees the work first-hand and what has already been tried. Look for evidence that could change your initial view. A useful evaluation narrows uncertainty enough to choose a proportionate next step.')
bullets(['What prompted this decision, and why now?','Which evidence is current, relevant and direct? What does it leave out?','Whose experience could challenge our interpretation?','What happens if we continue as we are?','Which uncertainty would change the choice, and how could we check it?'])
section('Capture three kinds of information','<b>Known:</b> the observation, source and date.<br/><b>Assumed:</b> the belief and why it seems plausible.<br/><b>Unknown:</b> what is missing, whether it matters and who can check it.')
callout('Carry forward','A short situation statement, the credible options, and the uncertainties that affect the decision. If a critical fact is missing, identify the check and owner before committing.')
text('<b>Watch for:</b> collecting more information without asking whether it can change the decision. Stop researching when the next useful step is a bounded test.','small')

new('Define','04 / Give the work a clear direction','What outcome matters, and what will we choose to do?')
text('Turn your evaluation into a direction people can act on. Describe the change you want to see, the people it should help and the trade-off you are prepared to make. Name the person accountable for the outcome.')
section('Work through it','Compare credible options, including maintaining the current approach. Agree the criteria before picking the favourite: customer value, commercial contribution, effort, reversibility and consequences may matter differently in each case.')
bullets(['What outcome are we trying to improve, for whom and by when?','What are we deliberately leaving outside the scope?','Which option best fits the evidence and our priorities?','What would indicate progress, and what baseline will we compare against?','Who owns the outcome, and what is the first practical action?'])
section('Write a decision statement','We will [action] for [audience or situation] to achieve [outcome]. We chose it because [evidence and trade-off]. [Owner] will begin with [next step]. We will review [measure or observation] at [date or trigger].')
callout('Carry forward','The chosen direction, why it was chosen, an accountable owner and a way to recognise progress. Record important alternatives so later reviewers understand the reasoning.')
text('<b>Watch for:</b> treating an activity as the outcome. Launching a tool is an activity; helping a team complete a task more reliably is an outcome.','small')

new('Govern','05 / Create the conditions for confident action','Who can decide, what needs checking, and when do we pause?')
text('Good governance gives people room to act within clear boundaries. Make checks specific to the decision and its consequences. The objective is to handle routine work confidently and direct attention to exceptions that warrant it.')
section('Agree the operating conditions','Name who makes the decision, who carries out the work and whose input is needed. Set limits that fit the situation: spending authority, accuracy, customer commitments, personal data, contractual obligations or other relevant constraints.')
bullets(['What can the owner proceed with independently?','Which facts or commitments need another person to verify?','What would require escalation, a pause or a change in direction?','Who receives that escalation, and how quickly must they respond?','What record is enough to explain what was decided and why?'])
section('Make a boundary usable','Replace “seek approval where appropriate” with a specific condition and contact. For example: “The owner can adjust the trial workflow within the agreed scope. Changes to customer commitments go to the commercial lead before implementation.”')
callout('Carry forward','Decision rights, proportionate checks, clear escalation triggers and a review point. If a reviewer is unavailable, agree the fallback rather than leaving ownership unclear.')
text('<b>Watch for:</b> a growing approval chain with no clear purpose. For every check, ask what it protects, who performs it and when it can be simplified.','small')

new('Elevate','06 / Apply improve and build capability','What will we do, learn and change?')
text('Put the decision into practice. Decide how much to commit now and what you want to learn before expanding it. Review the result against the original outcome and the conditions under which the work took place.')
section('Work through it','Give the first action an owner and a date. Capture the baseline before acting where feasible. Review what happened, not only what was intended. Ask the people doing and receiving the work what changed for them.')
bullets(['What is the smallest useful action that can advance the outcome?','What evidence would support continuing, adapting or stopping?','What changed because of our action, and what may have changed for other reasons?','What did the team learn that should alter the next decision?','What can be reused, and who needs to understand it?'])
section('Close the loop','At the review, record the result, the interpretation and the next action separately. If new evidence changes the situation, return to Evaluate. If priorities change, revisit Define. If the boundaries no longer fit, revisit Govern.')
callout('Carry forward','An explicit decision to continue, adapt or stop; a named next action; and learning others can use. Update the working practice or brief, not just the presentation about it.')
text('<b>Watch for:</b> declaring success because the work launched or a number improved. Compare with the baseline, consider other influences and be clear about what remains uncertain.','small')

new('A message about a change in direction','07 / Worked illustration','A team is moving a planned launch to allow more preparation.')
text('<b>Illustrative scenario:</b> the details below show how to use EDGE. They are not a report of an actual client or employer engagement. The immediate task is a message to the team, not a full launch review.','small',gap=18)
section('Evaluate','Confirm what has changed and who knows. The original launch date is agreed; the revised date is not. Some teams have already made plans. Check the reason for the change and which commitments need separate follow-up.')
section('Define','The message should explain the change, acknowledge its impact and tell people what to do next. The launch owner will communicate the confirmed decision and give a date for the next update, rather than presenting an unconfirmed date as settled.')
section('Govern','Verify the facts with the launch owner. Check whether any customer commitments or confidential details require separate handling. Make one person responsible for the update and identify where questions should go.')
section('Elevate','Send the message, review questions and follow up on misunderstandings. If several people interpret the next step differently, improve the instruction rather than repeating the original wording.')
callout('Illustrative message','We are moving the planned launch to allow more preparation. Please pause new commitments against the original date and flag any existing commitments to the launch owner. We will confirm the revised plan in Thursday’s team update. I know this affects work already under way; bring any dependencies or questions to that discussion.')
text('<b>What carried through:</b> the unconfirmed date identified in Evaluate became a clear update commitment in Define, a fact check in Govern and a question to resolve in Elevate.','small')

new('A shared process across two markets','08 / Worked illustration','A team is considering one customer onboarding process.')
text('<b>Illustrative scenario:</b> a business wants a more consistent onboarding experience in two markets. The numbers and conditions below are proposed trial choices, not claimed results or universal targets.','small',gap=18)
section('Evaluate','Map the existing handoffs with both local teams. Separate shared needs from differences in language, contracts and customer expectations. Check where customers wait and whether local workarounds solve a real requirement.')
section('Define','Choose a shared core with documented local variations. Trial it with one team in each market for four weeks. The desired outcome is clearer ownership and fewer avoidable handoffs. Record current completion times and rework before the trial; agree success criteria with the teams.')
section('Govern','Name one accountable process owner and a local lead in each market. Confirm customer commitments and relevant data-handling requirements before the trial. Local leads can change explanatory wording; changes to required information or commitments need review by the appropriate owner.')
section('Elevate','Review weekly with the trial teams. Compare completion times, rework and customer feedback with the baseline. Check whether case complexity changed. At four weeks, decide whether to extend, adapt or stop, then document useful local variations.')
callout('A practical pause trigger','Pause the affected part of the trial if a required customer or data-handling commitment cannot be met. Escalate to the named owner, identify the correction and agree the conditions for restarting.')
text('<b>The lesson:</b> consistency can come from a common outcome and clear ownership while execution respects local context.','small')

new('Your EDGE decision worksheet','09 / Reusable working page','Use one page for the decision you are facing now.')
text('Type into the fields below in a PDF reader that supports forms, or print this page. Keep answers short. Refer to supporting evidence where needed.','small')
fields=[('decision','Decision and accountable owner',35),('evaluate','EVALUATE  |  Evidence, assumptions and important unknowns',60),('define','DEFINE  |  Outcome, chosen direction and first step',60),('govern','GOVERN  |  Authority, checks and pause or escalation triggers',60),('elevate','ELEVATE  |  Action, measure and review date',60),('review','AT REVIEW  |  What happened and what we will change',46)]
for name,title,height in fields:
 text(title,'head',gap=5)
 c.acroForm.textfield(name=name,tooltip=title,x=48,y=y-height,width=499,height=height,fontName='Helvetica',fontSize=10,borderWidth=.5,borderColor=HexColor('#B3B7BD'),fillColor=white,textColor=ink,fieldFlags='multiline' if height>45 else '',forceBorder=True)
 y-=height+17
assert y>50,y

new('Use EDGE with a team','10 / Make the work proportionate','Bring one real decision and leave with an owner and a next step.')
text('A useful session should resolve something. Share the decision question and essential evidence beforehand. Invite the people who own the outcome and the people who understand the work, including local perspectives where relevant.')
section('Choose the depth','<b>A routine communication:</b> a short individual check may be enough.<br/><b>A reversible team decision:</b> use a brief discussion and the one-page worksheet.<br/><b>A consequential initiative:</b> involve the relevant functions, evidence and specialists. Set staged review points rather than forcing closure in one meeting.')
section('Facilitate the discussion','Move through the four pillars in order. Ask participants to distinguish facts from interpretations. Let people identify uncertainties before discussing preferred solutions. Capture the rationale, boundaries and next action in one shared record.')
section('Keep disagreement useful','Ask which assumption explains different views. If it can be tested, assign the check. If it reflects different priorities, make the trade-off explicit and refer it to the decision owner. Record material dissent where it could matter later.')
callout('Before the meeting ends','Can everyone explain the decision? Does the owner know what they can do now? Is the first action scheduled? Is there a review date or trigger? If any answer is unclear, resolve it before dispersing.')
text('The worksheet is a working aid. Add detail only when it improves the decision or helps someone act. A longer document is not evidence of better thinking.','small')

new('Practical tools and human judgement','11 / Explore rehearse and reflect','Use AI to widen the thinking while keeping responsibility clear.')
text('I have created tools on <link href="https://democratising.ai" color="#14264C">democratising.ai</link> to help people apply EDGE to specific situations. You can enter through the tool that matches your immediate need. Bring the context, outcome and relevant boundaries from the framework with you.')
for slug,name,body in [('edge-journey','EDGE working brief','Carry evidence, choices, responsibilities and learning through all four pillars. Work independently or request optional AI suggestions.'),('before-you-send','Before You Send','Review a message and compare a suggested revision with your original. Choose what to use and verify important claims.'),('edge-practice','EDGE Practice','Rehearse a conversation, negotiation or board discussion. The counterpart is fictional; a simulation is not a prediction.'),('brand-content','Brand and Content','Connect your brand brief, content planning and message review. Choose which context to carry forward and check the result.')]:section('<link href="https://democratising.ai/tools/'+slug+'" color="#14264C">'+name+'</link>',body)
callout('A useful briefing prompt','The decision is [question]. The intended outcome is [outcome]. We know [evidence] and are assuming [assumptions]. The boundaries are [constraints]. Help me identify alternatives and questions to check. Separate evidence from speculation and do not invent missing facts.')
text('Use only information you are authorised to share with the selected tool. Review its output yourself and verify important claims. Browse the current collection at <link href="https://democratising.ai/tools" color="#14264C">democratising.ai/tools</link>.','small')

new('Make the next decision better','12 / Review and continue','The value of EDGE lies in what changes in the work.')
text('Use a few measures tied to the purpose of the decision. A communication might be assessed through clarity of follow-up and completion of the requested action. An operating change might be assessed through customer experience, rework, delivery time or commercial contribution.')
section('Review the decision as well as the result','A good result can follow weak reasoning, and a well-reasoned choice can meet changed conditions. Ask what was known at the time, whether the boundaries were appropriate and which new information should alter the next decision. Avoid attributing every improvement to the framework.')
bullets(['Continue when the evidence supports the chosen direction and the conditions still hold.','Adapt when the outcome matters but the approach or assumptions need to change.','Stop when the rationale no longer holds or the consequences cannot be managed within agreed boundaries.'])
section('About the framework','EDGE was created by Adrian Watkins, a Singapore-based commercial and operating leader whose work spans growth, integration and governance across markets. The framework structures thinking and action. DARE, his shared publishing and data platform, supports the services built through <link href="https://democratising.ai" color="#14264C">democratising.ai</link>.')
section('Keep these links to hand','<link href="https://adrianwatkins.com/edge" color="#14264C">Framework and current guidance: adrianwatkins.com/edge</link><br/><link href="https://democratising.ai/tools" color="#14264C">Practical tools: democratising.ai/tools</link><br/><link href="https://adrianwatkins.com/contact" color="#14264C">Questions and conversations: adrianwatkins.com/contact</link>')
text('This paper presents the author’s practical method and illustrative applications. It does not report a controlled evaluation or claim a guaranteed improvement. The timing and scope of any application should reflect the decision.','small')
text('© 2026 Adrian Watkins. EDGE Framework. Practical edition 3.1. When referring to the framework, credit Adrian Watkins and link to <link href="https://adrianwatkins.com/edge" color="#14264C">adrianwatkins.com/edge</link>.','small')
c.save()
reader=PdfReader(OUT);assert len(reader.pages)==12;assert len(reader.get_fields())==6
alltext='\n'.join(p.extract_text() for p in reader.pages);assert '\u2014' not in alltext
# Extracted text is checked in memory; the public download remains a PDF.
print('Created',OUT,'pages',len(reader.pages),'fields',len(reader.get_fields()))
