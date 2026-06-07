class SearchEngine {
  constructor() {
    this.index = [];
    this.ready = false;
  }

  tokenize(text) {
    return text.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  }

  ngrams(word, min = 2, max = 4) {
    const set = new Set();
    for (let n = min; n <= max; n++) {
      for (let i = 0; i <= word.length - n; i++) {
        set.add(word.substring(i, i + n));
      }
    }
    return set;
  }

  async init() {
    if (this.ready) return;

    const [home, groups, detail] = await Promise.all([
      fetch('/data/home.json').then(r => r.json()),
      fetch('/data/groups.json').then(r => r.json()),
      fetch('/data/detail.json').then(r => r.json()),
    ]);

    const docs = [];

    home.forums.forEach((f, i) => {
      const course = Array.isArray(detail) && detail[i]?.course;
      docs.push({
        type: 'Forum',
        title: f.title,
        description: f.description,
        url: `/forum?index=${i}`,
        tags: [f.status].filter(Boolean),
        category: course?.category || '',
      });
    });

    home.mobile?.forums?.forEach((f, i) => {
      if (!docs.find(d => d.title === f.title)) {
        const course = Array.isArray(detail) && detail[i]?.course;
        docs.push({
          type: 'Forum',
          title: f.title,
          description: f.description,
          url: `/forum?index=${i}`,
          tags: [f.status].filter(Boolean),
          category: course?.category || '',
        });
      }
    });

    (groups.groups || []).forEach((g, i) => {
      docs.push({
        type: 'Grup',
        title: g.title,
        description: g.description,
        url: `/forum?group=${i}`,
        tags: [g.department],
        category: g.department,
        meta: `${g.members}/${g.maxMembers} anggota`,
      });
    });

    (Array.isArray(detail) ? detail : []).forEach((d, i) => {
      if (d.course) {
        docs.push({
          type: 'Kursus',
          title: d.course.title,
          description: d.course.description,
          url: `/forum?index=${i}`,
          tags: [d.course.category, d.course.status].filter(Boolean),
          category: d.course.category,
          meta: `${d.participants?.joined || 0}/${d.participants?.capacity || 0} peserta`,
        });
      }
    });

    docs.forEach(doc => {
      const raw = `${doc.title} ${doc.description} ${doc.tags.join(' ')} ${doc.category}`.toLowerCase();
      const terms = this.tokenize(raw);
      const ngramSet = new Set();
      terms.forEach(t => {
        this.ngrams(t).forEach(n => ngramSet.add(n));
      });

      doc._search = { raw, terms, ngrams: ngramSet };
    });

    this.index = docs;
    this.ready = true;
  }

  search(query) {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const qTerms = this.tokenize(q).filter(t => t.length >= 2);
    if (qTerms.length === 0) return [];
    const qNgrams = new Set();
    qTerms.forEach(t => this.ngrams(t).forEach(n => qNgrams.add(n)));

    const MIN_SCORE = 30;

    const scored = this.index.map(doc => {
      let score = 0;
      let directMatch = false;
      const qtMatched = new Set();
      const { raw, terms, ngrams } = doc._search;

      const titleLower = doc.title.toLowerCase();
      const descLower = doc.description.toLowerCase();

      qTerms.forEach(qt => {
        let hit = false;
        if (titleLower === qt) { score += 100; hit = true; }
        else if (titleLower.startsWith(qt) || titleLower.includes(` ${qt}`)) { score += 80; hit = true; }
        else if (titleLower.includes(qt)) { score += 60; hit = true; }

        if (descLower.includes(qt)) { score += 30; hit = true; }

        if (doc.tags.some(t => t.toLowerCase().includes(qt))) { score += 40; hit = true; }
        if (doc.category.toLowerCase().includes(qt)) { score += 35; hit = true; }

        if (hit) {
          directMatch = true;
          qtMatched.add(qt);
        }
      });

      if (directMatch && qTerms.every(qt => terms.some(t => t.startsWith(qt) || t.includes(qt)))) {
        score += 20;
      }

      if (directMatch) {
        const overlap = [...ngrams].filter(n => qNgrams.has(n)).length;
        if (overlap > 0) {
          const maxLen = Math.max(ngrams.size, qNgrams.size);
          score += (overlap / maxLen) * 25;
        }
      }

      const coverage = qtMatched.size / qTerms.length;
      score = score * coverage;

      return { ...doc, score };
    });

    return scored
      .filter(d => d.score >= MIN_SCORE)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);
  }
}

export const searchEngine = new SearchEngine();
