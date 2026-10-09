# Project Scratch — Development Journal

> Arbetsjournal och överlämning mellan arbetspass. Kompletterar Masterplanen, ersätter den inte.

## Arbetsregler

1. Vid START: läs senaste STOPP-post och verifiera branch, commit och filrader i GitHub innan kodning.
2. Vid STOPP: dokumentera ändringar, tester, risker, nästa steg och exakta filer/rader.
3. Särskilj **testat och godkänt** från **kodat men ej testat**.
4. Arbeta i små steg med exakta radnummer och tydliga instruktioner om commit. Användaren arbetar på iPhone.
5. Ändra aldrig `main` utan uttryckligt beslut.

---

## 2026-10-10 — STOPP / Överlämning

**Repository:** `MarreKromo/-project-scratch-prototype`  
**Arbetsbranch:** `af-06a4-supabase-integration`  
**Senast verifierade `src/App.jsx`-blob:** `397178026ccc204ddb1ac7924d765e5435f8bd5f` (blob-SHA, inte commit-SHA).  
**Status:** Fortsatt prototyputveckling. Inget arbete ska göras på `main` ännu.

### Genomfört och testat

- `Spara och avsluta` sparar aktiv runda lokalt innan appen navigerar till startsidan.
- `Fortsätt påbörjad runda` finns på startsidan.
- Påbörjad runda återupptogs med registrerade hål och överlevde siduppdatering.
- Färdig testrunda sparades i historiken och fanns kvar efter siduppdatering.
- Testknappen `Testa molnlagring` fick ett unikt ID; testet rapporterade `TEST OK: Rundan sparades och lästes tillbaka!`.
- Supabase `rounds` visade 12 poster vid kontrolltillfället. En 9-hålsrunda hade både håldata (`round`) och statistik (`metrics`): score 39, 17 puttar, GIR 3/9 (33 %), 5 fairways, 1 pliktslag.
- En runda sparades lokalt i flygplansläge. Efter återanslutning bekräftade användaren att den fanns i Supabase och kvar i appens historik.

### Kvarstående risker och tester

- Synkning mellan separata webbläsare/enheter är **inte verifierad**. Vercels produktionsversion och utvecklingsbranchen skiljer sig.
- Återhämtning efter nätverksavbrott lyckades i ett test, men skydd mot **samtidiga synkförsök** behöver granskas.
- `retryPendingRounds` har en `roundSyncRunning`-ref som skyddar återförsök, men `saveRound` gör ett eget molnanrop. Risk för överlappande anrop behöver analyseras.
- Rensa inte lokal lagring eller databasposter utan uttryckligt godkännande.

### Nästa arbetsmoment

**Steg:** `69S.15 – Skydd mot dubbelsynkning`  
**Branch:** `af-06a4-supabase-integration`  
**Fil:** `src/App.jsx`

**Senast verifierade kodpositioner:**

- Rad 455: `roundSyncRunning`.
- Rad 456–482: `retryPendingRounds`.
- Rad 484–488: automatisk retry-effekt.
- Rad 490–500: `online`-lyssnare.
- Rad 606: `saveRound` börjar.
- Cirka rad 683–705: ordinarie molnsparning i `saveRound`.

**Första åtgärd nästa pass:** Läs denna journal. Kontrollera aktuell branch, senaste commit och radnummer direkt i GitHub. Analysera möjliga överlappande molnanrop och föreslå minsta säkra kodändring. Ändra inte `main`.

### Beslut om arbetssätt

Masterplanen beskriver **vad** vi bygger. Denna journal beskriver **vad vi gjort, vad vi verifierat och exakt hur vi fortsätter**. Varje arbetspass ska få en START- och STOPP-post.

---

## Mall — nytt arbetspass

### YYYY-MM-DD — START

- Branch och senaste verifierade commit:
- Föregående STOPP och nuläge:
- Dagens mål:
- Kända risker:
- Första exakta steg (fil och rad):

### YYYY-MM-DD — STOPP

- Branch och senaste verifierade commit:
- Genomförda ändringar och filer:
- Tester godkända / ej genomförda / misslyckade:
- Öppna buggar och risker:
- Nästa exakta steg (fil och rad):
- Beslut och varningar:
