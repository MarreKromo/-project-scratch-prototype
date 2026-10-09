# PROJECT SCRATCH

## FULLSTÄNDIG MASTER ROADMAP

Golf OS × Golf DNA × Project Fairway | Roadmap v1.0 | 9 oktober 2026

STYRANDE PLAN • Ej ett påstående att funktioner är byggda eller lanseringsklara.

Syfte: skydda hela produktvisionen från att reduceras till en kort checklista. Denna roadmap kompletterar, men ersätter INTE, Product Master OS v1.0, specialist-Bibles eller Fairway Master Vision v1.1.

## Läs detta först

- Ingen offentlig lansering förrän de obligatoriska produkt-, säkerhets-, kvalitets-, integritets- och driftgrindarna är godkända.

- MVP, stängd alpha, beta, full produktvision och offentlig lansering är olika milstolpar. Att en funktion fungerar i ett manuellt test innebär inte att hela fasen är godkänd.

- Alla dokumenterade idéer ska ha en plats: planerad, framtida, villkorad, utforskande eller uttryckligen exkluderad från MVP. Ingenting får tyst försvinna.

- Project Scratch är huvudapp och golfutvecklingens kärna. Project Fairway är ett separat frivilligt RPG-läge i samma produkt; Golf DNA knyter ihop spelaridentiteten.

- Status i detta dokument är en ögonblicksbild 9 oktober 2026, inte en fullständig kod- eller säkerhetsrevision.

## Källhierarki och beslut

| Källa | Roll | Vad den styr |
| --- | --- | --- |
| Project Scratch OS v1.0 (25 sep) | Grundmaster | Vision, MVP, kvalitet, datarättigheter, releasegrindar, prioriteringsordning |
| Specialist-Bibles och MVP Contract | Domänkontrakt | Beräkningar, coaching, benchmarks, datamodell, tester; ersätts inte här |
| Scratch × Fairway Master Vision v1.1 (9 okt) | Tilläggsvision | Golf DNA, RPG, spelvärld, gemensam identitet, tre progressioner |
| Senaste verifierade arbetsflöde (9 okt) | Implementationsstatus | Supabase, kontoisolering, banlista, rundstart; begränsat manuellt test |
| Denna roadmap v1.0 | Styrning | Fullständig fasplan, beroenden, checklistor, status och lanseringsgrindar |

## 1. Produktlöftet – det som aldrig får förenklas

Vi bygger inte bara en scorecard- eller statistikapp. Produkten ska omvandla spelade rundor till begriplig analys, ett prioriterat One Focus, relevant träning, ett mätbart nästa-runda-mål och trovärdig långsiktig förbättring. Premium, lugn, ambitiös och begriplig för olika handicapnivåer.

- Primär loop: sätt mål → spela → registrera → förstå → One Focus → träna → mät nästa runda → följ utvecklingen.

- Golf OS ska fungera helt självständigt utan RPG. Gamification får aldrig förvränga verkliga golfmått.

- Användarens egen historik är primär referens; externa benchmarks får bara användas med dokumenterade rättigheter och rimlig evidens.

- One Focus ska vara stabilt, förklarligt och ge en konkret uppgift – inte generiska eller upprepade AI-svar.

- Projektet ska vara mobilvänligt, tillgängligt, offline-tåligt, versionsbart och skydda rådata.

## 2. Roadmapens två nivåer

| Nivå | Innebörd |
| --- | --- |
| A. MVP/Alpha/Beta – obligatorisk kärna | Säker rundregistrering, tillförlitlig statistik, coachens faktabaserade återkoppling, progression, testbar drift och efterlevnad. |
| B. Full produktvision – skyddat framtidsomfång | Golf DNA på djupet, badges/Locker Room, Project Fairway RPG, sociala funktioner, gästläge, avancerad analys och möjliga integrationer. |

Viktigt: Projekt Fairway och sociala funktioner finns uttryckligen utanför ursprunglig MVP i OS v1.0, men har en egen bevarad genomförandeplan i Fairway Vision v1.1. Deras exakta placering före/efter offentlig lansering är ett ÖPPET produktbeslut, inte ett tyst antagande.

## 3. Statusordbok

| Markering | Definition |
| --- | --- |
| VERIFIERAT | Kod eller beteende granskat/testat inom angiven omfattning; inte generellt produktionsgodkännande. |
| PÅGÅR | Arbete aktivt men acceptansgrind ej passerad. |
| PLANERAT | Krav/idé dokumenterad; implementation eller test ej verifierat. |
| FRAMTIDA | Bevarat utanför nuvarande MVP. |
| GATED | Får inte ske före särskild rättighets-, integritets-, kvalitets- eller säkerhetsgrind. |
| ÖPPET | Behöver beslut eller separat specifikation. |
| BLOCKERAD | Saknar obligatoriskt beroende. |

## 4. Nuvarande tekniska ögonblicksbild

- Pågående arbetsbranch: af-06a4-supabase-integration. Gör inga oavsiktliga ändringar i main.

- Supabase-autentisering, molnsparade rundor, banor och onboarding har fungerat i manuella tester.

- Två separata konton har testats: det nya såg inte det gamlas rundhistorik; det ursprungliga kontots runda fanns kvar efter kontobyte. Detta är positiv evidens men inte fullständig RLS-/penetrationstestning.

- Kontobunden lokal lagring och felhantering har granskats; appen startade i Preview.

- Ny användares banlista är tom; Hulta som förvald synlig bana har tagits bort. Skydd mot rundstart utan vald personlig bana är inlagt och granskat.

- Nästa praktiska test: skapa Testbanan GK (9 hål) på testkonto, verifiera rundinställning, start, sparning, historik, omladdning och kontoavskiljning.

- AF-05 Training & Time har separat dokumenterad testhistorik; dess slutliga integration/merge är inte härmed bekräftad.

## FAS 0. Styrning, inventering och trygg arbetsbranch

STATUS: PÅGÅR   |   SYFTE: En obruten och spårbar grund utan att förlora tidigare arbete.

### Omfattning

- Inventera aktuella GitHub-brancher, commits, skillnader mot main och öppna integrationer.

- Samla masterdokument, specialist-Bibles, acceptanskriterier och senaste Fairway Vision; bygg kravregister med ID och källreferens.

- Upprätta beslutsliggare: BESLUTAT, DISKUTERAT, FÖRSLAG, ÖPPET, FRAMTIDA, GATED.

- Kartlägg teknisk skuld, dubbletter, tillfälliga testknappar och återställningsväg.

- Frys inga tidigare beslut genom antaganden; konflikt löses med uttryckligt beslut.

### Acceptansgrind – klart först när

- Alla kritiska krav har ägare, fas, beroende, test och status.

- Ingen branch mergas utan diff, testprotokoll och återställningsplan.

- Befintliga master- och specialistdokument arkiveras, inte raderas av misstag.

## FAS 1. Konton, säkerhet, lagring och datamodell

STATUS: PÅGÅR   |   SYFTE: Stabil fleranvändargrund som inte läcker eller förlorar golfdata.

### Omfattning

- Inloggning, registrering, återställning av lösenord, sessioner och utloggning.

- RLS/auktorisering per resurs: profiles, rounds, courses, training_sessions, golf_dna och framtida RPG-data.

- Kontobunden lokal lagring; utloggning/kontobyte utan sammanblandning; hantera skadad lagring.

- Versionerad datamodell, migrationer, idempotens, synk-konflikter, backup och återställning.

- Integritetsflöden: dataminimering, export, radering, processorlista och loggning utan onödiga personuppgifter.

- Granska testknappar, miljövariabler, hemligheter, rate limits och behörighetsregler.

### Acceptansgrind – klart först när

- Två konton kan skapa, läsa, uppdatera och radera egna objekt; försök att nå andras objekt nekas server-side.

- Rundor och banor överlever omladdning, sessionbyte och nätverksavbrott utan datatapp.

- Migrationer har testad rollback/återställning; behörighetstester automatiseras.

- Inga säkerhetskritiska öppna fel inför extern alpha.

Beroenden / avgränsning: Grund för alla senare faser.

## FAS 2. Golfbanor och komplett rundregistrering

STATUS: PÅGÅR   |   SYFTE: Snabb och korrekt registrering av 9/18-hålsrundor.

### Omfattning

- Egen bana, tee, hål, par; Course Rating/Slope valfria och aldrig gissade.

- Per hål: bruttoscore, puttar, GIR, tee-resultat på par 4/5, pliktslag.

- Korrekt hantering av saknade värden, par 3, ofullständiga/avbrutna rundor och träningsrundor.

- Rundstart, paus, återupptagning, korrigering, historik, detaljvy och återställning efter refresh.

- Round-version och course/tee-version kopplad till historik; runda får inte tyst byta bana.

- Quick Mode och mer detaljerad registrering ska testas för faktisk användbarhet.

### Acceptansgrind – klart först när

- Testbanan GK kan skapas på nytt konto; 9 hål kan spelas och sparas.

- Rundor syns på rätt konto och kan korrigeras utan att tidigare data försvinner.

- 9 och 18 hål jämförs inte felaktigt; ofullständiga rundor räknas inte som fullständiga.

- Round capture fungerar även om AI eller nätverk inte gör det.

Beroenden / avgränsning: Förutsätter fas 1:s grundskydd.

## FAS 3. Statistikmotor och evidens

STATUS: PLANERAT / DELVIS PROTOTYP   |   SYFTE: Korrekt RAW → DERIVED → INTERPRETED → ACTION.

### Omfattning

- Bas: score, score mot par, snittscore, GIR%, fairway% med korrekt nämnare, puttar, puttar per GIR, penalties, birdies/bogeys/dubbelbogeys.

- Utökning enligt statistik-Bible: scrambling, up-and-down, sand save, scoring conversion, relevanta trender och datatäckning där indata finns.

- Historiska tidsfönster, per-bana/tee, 9/18-hålsseparering och datakvalitet.

- Definitioner, enheter, versionsmetadata, reproducerbara beräkningar och regressionstester.

- Rätta känd Bogey Avoidance-dubblett i Statistics Bible v1.1 före implementering.

- Inga påhittade benchmarks, ingen falsk Strokes Gained; avancerade mått först när datan räcker.

### Acceptansgrind – klart först när

- Testbibliotek med syntetiska golfare ger förväntade värden för varje mått.

- Saknade observationer blir okända, inte automatiskt noll.

- Ändrad runda räknar om beroende statistik deterministiskt.

- Visade slutsatser har källbar data och begränsningar.

Beroenden / avgränsning: Beroende av fas 2 och statistik-Bible.

## FAS 4. AI-coach, One Focus och Knowledge Library

STATUS: PLANERAT / PROTOTYP FINNS   |   SYFTE: En användbar coach som ger konkreta, belagda förbättringsbeslut.

### Omfattning

- Rundsammanfattning: vad hände, varför, viktigaste utvecklingsmöjlighet.

- One Focus med stabilitetsregler, confidence och uppföljningshorisont.

- Träningsuppgift/strategi ur godkänt Knowledge Library med dos och framgångskriterium.

- Ett eller två mätbara mål för nästa runda; uppföljning efter ny runda.

- Coachminne som är versionerat, korrigerbart och integritetssäkert.

- AI får förklara men inte hitta på beräkningar, kausalitet eller swingdiagnoser utifrån scorecard.

- Offline/nätverksfel får aldrig hindra sparning av runda.

### Acceptansgrind – klart först när

- Olika typer av rundor ger relevanta, inte identiska standardsvar.

- Varje rekommendation kan förklaras av faktiska datapunkter.

- Insufficient data ger tydlig osäkerhet och inga falska påståenden.

- Rundsparning fungerar när coachen inte är tillgänglig.

Beroenden / avgränsning: Fas 3 och godkänd Knowledge Library.

## FAS 5. Progression, mål, träning och premium-UX

STATUS: PLANERAT / DELVIS PROTOTYP   |   SYFTE: Göra utvecklingen tydlig och motiverande över många rundor.

### Omfattning

- Journeys: Break 100, Sub-90, Sub-80, Project Single, Project Scratch; Project Elite framtida.

- Hero-kort med aktiv resa, nästa etapp, mål, historik och trovärdiga milstolpar.

- Progression states och focus lifecycle med baslinje, förbättring, stagnation och underlag.

- Training & Time: träningspass, kategorier, spelad nettotid, historik, trender och total tid.

- 10 000 timmar får visas som statistik – aldrig som påtvingat mål.

- One Focus och nästa-runda-mål före komplexa diagram i gränssnittet.

- Premium mobil design, tomlägen, tillgänglighet, lokalisering och konsekvent navigation.

### Acceptansgrind – klart först när

- Användaren förstår huvudinsikten inom ungefär fem sekunder i test.

- Progression baseras på rätt historik och överdriver inte osäker förbättring.

- Träning och rundtid sparas och synkas korrekt.

- Fullständiga användarflöden fungerar på mobil med tillräckliga touchytor.

## FAS 6. Golf DNA – verklig spelaridentitet

STATUS: PLANERAT, FÖRDJUPNING EFTER KÄRNKVALITET   |   SYFTE: Visa hur spelaren faktiskt spelar och utvecklas.

### Omfattning

- Golf DNA-profil: styrkor, svagheter, spelstil, datatäckning och historiska förändringar.

- Kandidatattribut: putting, utslagsprecision, inspel/GIR, scoring, recovery och konsistens – exakta formler ÖPPNA.

- Datagrundade arketyper och nivåanpassade jämförelser; inga godtyckliga betyg.

- Avatar, badges, troféer och Locker Room som separata belöningslager.

- Förtjänade badges med dokumenterade trösklar, svårighetsgrader och omräkning vid redigering.

- Profilen ska kunna vara privat; social synlighet är separat opt-in och kräver särskilda kontroller.

### Acceptansgrind – klart först när

- Varje DNA-attribut har formel, minsta underlag, version, osäkerhet och testfall.

- Inga RPG-poäng påverkar verklig Golf Ability eller handicap.

- Belöningar kan förklaras och korrigeras vid ändrad data.

- Golf OS kan användas fullt utan avatar/RPG.

Beroenden / avgränsning: Fas 3–5. Ursprunglig OS v1.0 placerar stor Golf DNA/social profil efter MVP.

## FAS 7. Project Fairway – separat RPG-läge

STATUS: PLANERAT / STRATEGISK VISION   |   SYFTE: En spelbar golfkarriär som motiverar utan att korrumpera golfdata.

### Omfattning

- Fairway öppnas som separat läge i Project Scratch, inte som en ihopklistrad extern sida.

- Vertikal skiva i Greenhaven Valley: avatar, mentor Thomas Reed, rival Alex Morgan, en berättelsekedja, turnering/uppdrag och sparad karriär.

- Framtida regioner: Stormcliff Coast, Redstone Desert och Crown City; agent Sofia Bennett och fler NPC:er.

- Spelmekanik: quests, val med konsekvenser, dialoger, karriärhändelser, sponsorer, rivaler, kosmetiska belöningar.

- Tre åtskilda spår: Golf Ability (verklig evidens), Career Reputation (berättelse/tävling), RPG Level (XP/upplåsningar).

- Definiera XP-källor, anti-fusk, gränser, ändrings-/raderingshantering och idempotenta event.

- Gemensam spelaridentitet och tydlig dataöverföring; Fairway får inte skriva direkt till rå golfstatistik.

### Acceptansgrind – klart först när

- En spelbar och återupptagbar vertikal skiva finns, med separata och testade progressionsspår.

- Samma runda kan inte ge samma belöning två gånger efter refresh eller omsparning.

- RPG fungerar som frivilligt läge; statistik/coach fungerar utan RPG.

- Värld, NPC, uppdrag och ekonomi har specificerade ägarskap och tester.

Beroenden / avgränsning: Full integration efter säker kärna. Tidpunkt relativt offentlig lansering är ÖPPET beslut.

## FAS 8. Sociala profiler, grupper och community

STATUS: FRAMTIDA / GATED   |   SYFTE: Frivillig social motivation med integritet och rättvisa.

### Omfattning

- Vänner, privata grupper, profilvisning, topplistor och jämförelser.

- Profil- och aktivitetssekretess, blockering, rapportering och moderering.

- Rättvisa jämförelser mellan olika antal rundor, banor och handicapnivåer.

- Barn-/juniorfrågor som separat juridiskt och produktmässigt arbete; MVP är inte barnriktad.

### Acceptansgrind – klart först när

- Ingen publik social funktion utan testad sekretess, rapport/block och missbrukshantering.

- Inga otillåtna personuppgifter exponeras för andra konton.

- Leaderboard-regler och fuskhantering är dokumenterade.

Beroenden / avgränsning: Uttryckligen utanför ursprunglig MVP.

## FAS 9. Framtidsfunktioner och integrationsportfölj

STATUS: FRAMTIDA / OFTA GATED   |   SYFTE: Bevara idéerna utan att låta dem störa kärnans kvalitet.

### Omfattning

- Gästläge: prova utan konto; tydlig lokal datalivscykel och säker överföring till konto (nyligen överenskommet att göra senare).

- Apple Watch, Garmin, Arccos/Shot Scope och andra importflöden först med API-/datatillstånd.

- AI Caddie, strategi före/under runda och eventuellt voice coach.

- Svingvideoanalys först med lämpligt underlag, samtycke och tydliga gränser.

- Full shot-level data, kartor och riktig Strokes Gained först med korrekt insamling och baseline.

- Handicap Simulator/Potential Score och Project Elite efter validering.

- Framtida anonymiserade kohortbenchmarks endast med tillräcklig kvalitet och integritet.

- Officiell WHS, GIT/Min Golf, externa kommersiella data endast med rättigheter/avtal.

### Acceptansgrind – klart först när

- Varje idé har en ägare, produktnytta, datakrav, risk, kostnad och prioriteringsbeslut innan implementation.

- Ingen extern källa eller officiell status används utan verifierade rättigheter.

- Inga framtidsfunktioner betraktas som levererade bara för att de finns i roadmapen.

## FAS 10. Kvalitet, drift, alpha och beta

STATUS: OBLIGATORISK FÖRE PUBLIK SKALA   |   SYFTE: Bevisa att produkten är pålitlig för fler än grundaren.

### Omfattning

- Automatiska tester: statistik, rundflöden, auth/RLS, synk, migrering, kontobyte, offline och återställning.

- Instrumentering: datakvalitet, aktivering, förståelse, träningshandling, transfer, utveckling och retention.

- Crash/error monitoring, loggning utan känsliga uppgifter, feature flags och coach kill switch.

- Incidentrutiner, support, återställning, backups, dependency scanning och versionskontroll.

- Stängd alpha med definierad testgrupp; sedan kalibrering och beta med återkoppling.

- Testa tillgänglighet, mobil UX, prestanda och påståenden om förbättring.

### Acceptansgrind – klart först när

- Kritiska integritets-/säkerhets-/datatappsfel stängda före extern alpha.

- Rollback och backup/restore har demonstrerats.

- Coach och statistik klarar syntetisk QA och verkliga testscenarier.

- Beta visar faktisk användbarhet och återkommande nytta; inga falska prestationslöften.

## FAS 11. Affär, varumärke, juridik och release

STATUS: GATED / LÅNGT FRAM   |   SYFTE: Förbereda ett ansvarsfullt lanseringsbeslut.

### Omfattning

- Varumärkes- och domänkontroll Sverige/EU/USA, App Store/Google Play; inget namn antas godkänt.

- Affärsmodell: freemium/trial/subscription är utforskande, inte beslutad.

- Terms, Privacy, GDPR-processer, processorregister, rättigheter, dataexport och kontoradering.

- Appbutikernas privacy/data safety, billing, kontoraderingskrav och faktisk SDK-granskning.

- Driftbudget, support, incidentansvar, supportåtkomst och releaseplan.

- Go/no-go-beslut först efter att samtliga relevanta grindar är signerade.

### Acceptansgrind – klart först när

- Lanseringsnamn och nödvändiga licenser är klarerade.

- Juridiska och butiksspecifika krav är kontrollerade för faktiskt scope.

- Release, rollback, support och dataradering är testade.

- Inga blockerande kvalitets- eller säkerhetsbrister återstår.

Beroenden / avgränsning: Lanseringsdatum fastställs inte innan tillräcklig validering.

## 5. Tvärgående krav – får aldrig försvinna

| ID | Krav | När verifieras |
| --- | --- | --- |
| X-01 | Rå golfdata och rundor får inte gå förlorade | Varje datamigration/release |
| X-02 | Säker server-side behörighet per konto och resurs | Fas 1, varje ny tabell |
| X-03 | Offline-first eller likvärdigt hållbar round capture | Fas 2, 10 |
| X-04 | Mätdefinitioner, null-hantering och 9/18-hålskorrekthet | Fas 3 |
| X-05 | Evidens och transparens för AI/One Focus | Fas 4 |
| X-06 | Korrigering av runda omräknar statistik, DNA och badges | Fas 3–7 |
| X-07 | Separata Golf Ability / Career Reputation / RPG Level | Fas 6–7 |
| X-08 | Rättigheter för externa benchmarks, banor och WHS | Fas 3, 9, 11 |
| X-09 | Integritet, export, radering och processorspårbarhet | Fas 1, 10–11 |
| X-10 | Tillgänglighet, språk, måttenheter och mobil UX | Fas 2–11 |
| X-11 | Versioner, tester, rollback, loggar och support | Fas 0–11 |
| X-12 | Barn- och communityrisker bedöms före social/junior | Fas 8 |
| X-13 | RPG får aldrig vara pay-to-win eller påverka golfmått | Fas 6–7 |
| X-14 | Gästdata isoleras och migreras kontrollerat vid konto | Fas 9 |
| X-15 | Alla nya idéer registreras i roadmap/parking lot | Varje produktbeslut |

## 6. Obligatoriska releasegrindar – ingen genväg

- G0 Dokument: alla kritiska krav, beräkningar, användarflöden och öppna risker har tydliga versioner.

- G1 Dataintegritet: 9/18 hål, korrigering, historik, offline, synk, migrering, backup/restore testade.

- G2 Säkerhet: RLS, sessioner, behörigheter, secrets, kontobyte, missbruk och beroenden testade.

- G3 Coaching: påståenden evidensbaserade, One Focus stabilt, ingen hallucinerad statistik.

- G4 UX: mobil, tillgänglighet, snabba flöden och begripliga slutsatser validerade.

- G5 Privacy/legal: export/radering, policy, datarättigheter, licenser och relevanta regulatoriska krav.

- G6 Drift: övervakning, incident, support, feature flags, rollback och releaseplan.

- G7 Extern validering: alpha/beta genomförda med dokumenterade fynd och åtgärder.

- G8 Produktomfång: tydligt beslut om Fairway/Golf DNA/gäst/social ingår vid lansering eller efteråt; inga tysta bortfall.

## 7. Uppdateringsregel – så tappar vi inte bort idéer igen

- Varje ny idé får ett krav-ID, källa/datum, status, berörd fas, beroenden, acceptanstest och versionsnotering.

- En fas kan aldrig markeras KLAR på grund av enbart kod-commit eller ett manuellt test.

- Varje arbetskväll avslutas med: senaste branch/commit, vad som verifierats, vad som inte verifierats, nästa ENDA kodsteg.

- Vid ändrat scope uppdateras både roadmap och relevant master/specialistdokument. Ändringen loggas som tillägg, ersättning eller uppskjutning.

- Inga tidigare krav tas bort utan uttryckligt SUPERSEDED-beslut med skäl och spårbarhet.

- Inför alpha/beta/lansering görs en krav-för-krav-avstämning mot samtliga källdokument.

## 8. Öppna strategiska beslut

- Vilken nivå av Golf DNA och Fairway måste vara färdig innan första offentliga lanseringen? Visionen är bevarad; release-scope ännu inte låst.

- Vilka exakta DNA-attribut, formler, minsta datamängder och badge-trösklar gäller?

- Hur fungerar Fairways XP, ekonomi, sponsorer, NPC:er, konsekvenser och anti-fusk?

- Vilken datamodell/eventkedja knyter ihop Golf OS, DNA och RPG utan dubbelräkning?

- När prioriteras gästläge och vilka funktioner är tillgängliga utan konto?

- Vilket lanseringsnamn, affärsmodell och vilka marknader är juridiskt och kommersiellt realistiska?

## 9. Källor och begränsningar

- Project_Scratch_OS_v1.0_Consolidated_Master(1).docx, 25 september 2026, särskilt avsnitt 1–29.

- Project_Scratch_Fairway_Master_Vision_v1.1_Utökad.docx, 9 oktober 2026, särskilt avsnitt 13–25.

- Senaste samtal och GitHub-verifierade arbetssteg till och med steg 66A/66B, 9 oktober 2026.

- Fasnumrering och acceptansgrindar i denna fil är en ny sammanhållen planeringsstruktur. De ersätter inte källdokumentens ordalydelse eller specialistkontrakt.

- Ingen fullständig genomgång av samtliga historiska chattar eller full säkerhets-/kodrevision har utförts i samband med detta dokument. Okända luckor måste hanteras i kravregistret.

VERSION 1.0 • Roadmap skapad 9 oktober 2026. Nästa ändring ska få versionsnummer och beslutslogg.
