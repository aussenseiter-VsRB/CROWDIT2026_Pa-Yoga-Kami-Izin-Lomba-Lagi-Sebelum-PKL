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

    home.forums.forEach(f => {
      docs.push({
        type: 'Forum',
        title: f.title,
        description: f.description,
        url: '/groups',
        tags: [f.status],
        category: f.title.split(' ').slice(-2).join(' '),
      });
    });

    home.mobile?.forums?.forEach(f => {
      if (!docs.find(d => d.title === f.title)) {
        docs.push({
          type: 'Forum',
          title: f.title,
          description: f.description,
          url: '/groups',
          tags: [f.status],
          category: '',
        });
      }
    });

    (groups.groups || []).forEach(g => {
      docs.push({
        type: 'Grup',
        title: g.title,
        description: g.description,
        url: '/groups',
        tags: [g.department],
        category: g.department,
        meta: `${g.members}/${g.maxMembers} anggota`,
      });
    });

    (Array.isArray(detail) ? detail : []).forEach(d => {
      if (d.course) {
        docs.push({
          type: 'Kursus',
          title: d.course.title,
          description: d.course.description,
          url: '/detail',
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

    const qTerms = this.tokenize(q);
    const qNgrams = new Set();
    qTerms.forEach(t => this.ngrams(t).forEach(n => qNgrams.add(n)));

    const MIN_SCORE = 30;

    const scored = this.index.map(doc => {
      let score = 0;
      let directMatch = false;
      const { raw, terms, ngrams } = doc._search;

      const titleLower = doc.title.toLowerCase();
      const descLower = doc.description.toLowerCase();

      qTerms.forEach(qt => {
        if (titleLower === qt) { score += 100; directMatch = true; }
        else if (titleLower.startsWith(qt) || titleLower.includes(` ${qt}`)) { score += 80; directMatch = true; }
        else if (titleLower.includes(qt)) { score += 60; directMatch = true; }

        if (descLower.includes(qt)) { score += 30; directMatch = true; }

        if (doc.tags.some(t => t.toLowerCase().includes(qt))) { score += 40; directMatch = true; }
        if (doc.category.toLowerCase().includes(qt)) { score += 35; directMatch = true; }
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

      return { ...doc, score };
    });

    return scored
      .filter(d => d.score >= MIN_SCORE)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);
  }
}

export const searchEngine = new SearchEngine();
