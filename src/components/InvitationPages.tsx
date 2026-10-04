import { Bismillah, Flourish, Mosque, PageFrame } from './Artwork';
import { invitationConfig } from '../config';

function PageHeading({ telugu = false }: { telugu?: boolean }) {
  return <header className="page-heading"><p className="invocation">{telugu ? 'బిస్మిల్లా హిర్రహ్మా నిర్రహీమ్' : <>In the name of <b>ALLAH</b> the Most Beneficient &amp; the Most Merciful</>}</p><div className="heading-emblems"><Mosque crescent /><div><Bismillah /><h2>{telugu ? 'షాదీ ముబారక్' : 'Wedding Invitation'}</h2><Flourish /></div><Mosque /></div></header>;
}

export function EnglishPage() {
  return <article className="invitation-page english paper" lang="en" aria-label="English invitation">
    <PageFrame /><PageHeading />
    <div className="page-copy">
      <p className="hosts accent">Mr. Syed Abdullah &amp; <span>Mrs. Mohammed Zakirunnisa</span></p>
      <p>request the honour of your gracious presence &amp; blessings with family<br className="desktop-break" /> on the auspicious occasion of the Marriage of our son</p>
      <p className="person">Barkhurdar : <strong>Syed Imam</strong> <small>B.Tech.</small></p>
      <p className="with">with</p>
      <p className="person">Noor-e-chashmi : <strong>Mohammed {invitationConfig.brideName}</strong> <small>M.B.A., ACMA</small></p>
      <p>(D/o. Janab Mohammad Habibullah Shah &amp; Mrs. Md. Hajira Sultana<br className="desktop-break" /> Machavaram, Vijayawada.)</p>
      <div className="event"><h3>Nikah : Insha Allah</h3><p>On Sunday, 25th October, 2026 at 10-30 A.M.</p></div>
      <div className="venue"><h4>Venue :</h4><strong>Amma Kalyanamandapam,</strong><p>I.T.I. College Road, Sunnapubattila Centre,<br />Siddhartha Nagar, Vijayawada.</p></div>
      <p className="lunch"><b>Lunch :</b> 12-00 noon onwards</p>
      <div className="valima"><h3>Valima &amp; Dinner</h3><p>On Monday, 26th October, 2026 at 7-00 P.M.</p><p>at <strong>Amma Kalyanamandapam,</strong></p><p>I.T.I. College Road, Sunnapubattila Centre,<br />Siddhartha Nagar, Vijayawada.</p></div>
      <p className="compliments">With the best compliments from Near &amp; Dear</p>
    </div>
  </article>;
}

export function TeluguPage() {
  return <article className="invitation-page telugu paper" lang="te" aria-label="Telugu invitation">
    <PageFrame /><PageHeading telugu />
    <div className="page-copy">
      <p>మా కుమారుడు</p>
      <p className="person">బర్-ఖుర్-దార్ : <strong>సయ్యద్ ఇమామ్</strong> <small>B Tech</small></p>
      <p className="person">నూర్-ఎ-చష్మి : <strong>మొహామ్మద్ సర్వతున్నిసా</strong> <small>M.B.A., ACMA</small></p>
      <p>(విజయవాడ, మాచవరం వాస్తవ్యులు)</p>
      <p className="parents"><b>జనాబ్ మొహామ్మద్ హాబీబుల్లా షా &amp; శ్రీమతి మొహామ్మద్ హజీరా సుల్తానా</b> గార్ల కుమార్తె</p>
      <div className="event"><h3>నిఖా : ఇన్-షా-అల్లా</h3><p>ది. <b>25-10-2026</b> ఆదివారం ఉదయం గం॥ <b>10-30</b> నిమిషాలకు</p></div>
      <div className="venue"><h4>నిఖా వేదిక :</h4><strong>అమ్మ కళ్యాణమండపము,</strong><p>ఐ.టి.ఐ. కాలేజీ రోడ్, సున్నపుబట్టీల సెంటర్, సిద్ధార్థనగర్, విజయవాడ.</p></div>
      <p className="lunch"><b className="accent">విందు :</b> మధ్యాహ్నం <b>12-00</b> గంటలకు</p>
      <div className="valima"><h3>వలీమా - విందు</h3><p>ది. <b>26-10-2026</b> సోమవారం రాత్రి <b>7-00</b> గంటలకు</p><strong>అమ్మ కళ్యాణమండపము,</strong><p>ఐ.టి.ఐ. కాలేజీ రోడ్, సున్నపుబట్టీల సెంటర్, సిద్ధార్థనగర్, విజయవాడ.</p></div>
      <div className="telugu-request"><h4>విన్నపము :</h4><p>ఆత్మీయులైన తామెల్లరు తప్పక విచ్చేసి నూతన వధూవరులను ఆశీర్వదించి<br className="desktop-break" /> మా ఆతిథ్యం స్వీకరించి మమ్ములను ఆనందింపజేయ కోరుచున్నాము.</p><p className="signoff">ఆహ్వానించువారు<br /><strong>సయ్యద్ అబ్దుల్లా<br />శ్రీమతి మొహామ్మద్ జాకీరున్నిసా</strong></p></div>
      <p className="compliments">బంధుమిత్రుల అభినందనలతో</p>
    </div>
  </article>;
}
