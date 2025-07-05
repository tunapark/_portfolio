import { promotions } from './data.js';

document.addEventListener('DOMContentLoaded', () => {
    const state = {
        currentView: 'performance',
        activeTags: new Set(),
        sortBy: 'latest',
        searchTerm: ''
    };

    const curationTabs = document.getElementById('curation-tabs');
    const tagFiltersContainer = document.getElementById('tag-filters');
    const promotionGrid = document.getElementById('promotion-grid');
    const sortBySelect = document.getElementById('sort-by');
    // const searchInput = document.getElementById('search-input'); // 검색창 제거로 인해 주석 처리
    const dashboardContainer = document.getElementById('view-dashboard');
    let charts = {};

    function destroyCharts() {
        Object.values(charts).forEach(chart => chart.destroy());
        charts = {};
    }

    function renderPerformanceDashboard() {
        destroyCharts();
        dashboardContainer.innerHTML = `
            <div class="dashboard-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                <div class="kpi-card lg:col-span-2">
                    <h3 class="font-bold text-lg text-slate-800 mb-1">주요 지표</h3>
                    <p class="text-sm text-slate-500 mb-4">현재 활성 프로모션 기준</p>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="text-center">
                            <p class="text-3xl font-bold text-blue-600">25%</p>
                            <p class="text-sm text-slate-600">평균 할인율</p>
                        </div>
                        <div class="text-center">
                             <p class="text-3xl font-bold text-green-600">128</p>
                            <p class="text-sm text-slate-600">신규 프로모션(24h)</p>
                        </div>
                    </div>
                </div>
                <div class="chart-container">
                    <h3 class="font-bold text-lg text-slate-800 mb-4">Top 5 할인율 카테고리</h3>
                    <canvas id="category-discount-chart" style="max-height: 150px;"></canvas>
                </div>
                <div class="chart-container">
                    <h3 class="font-bold text-lg text-slate-800 mb-4">프로모션 유형(24h)</h3>
                    <canvas id="promotion-type-chart" style="max-height: 150px;"></canvas>
                </div>
            </div>
        `;
        
        const catCtx = document.getElementById('category-discount-chart').getContext('2d');
        charts.category = new Chart(catCtx, {
            type: 'bar',
            data: {
                labels: ['패션', '뷰티', '가전', '식품', '스포츠'],
                datasets: [{
                    label: '평균 할인율 (%)',
                    data: [45, 42, 35, 28, 25],
                    backgroundColor: 'rgba(74, 144, 226, 0.7)',
                    borderColor: 'rgba(74, 144, 226, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } }
            }
        });

        const typeCtx = document.getElementById('promotion-type-chart').getContext('2d');
        charts.type = new Chart(typeCtx, {
            type: 'pie',
            data: {
                labels: ['할인', '쿠폰', '1+1', '사은품'],
                datasets: [{
                    data: [55, 25, 15, 5],
                    backgroundColor: ['#4A90E2', '#50E3C2', '#F5A623', '#BD10E0']
                }]
            },
            options: { responsive: true, plugins: { legend: { position: 'right' } } }
        });
    }

    function renderCreativeDashboard() {
        destroyCharts();
        const creativePromos = promotions.filter(p => p.curationViews.includes('creative')).slice(0, 4);
        dashboardContainer.innerHTML = `
            <div class="dashboard-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div class="lg:col-span-2 chart-container">
                    <h3 class="font-bold text-lg text-slate-800 mb-4">주목받는 캠페인 비주얼</h3>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        ${creativePromos.map(p => `
                            <a href="#" class="creative-gallery-item">
                                <img src="${p.image}" alt="${p.title}">
                            </a>
                        `).join('')}
                    </div>
                </div>
                <div class="chart-container">
                    <h3 class="font-bold text-lg text-slate-800 mb-4">많이 사용된 키워드</h3>
                    <div class="flex flex-wrap gap-2 items-center justify-center h-full">
                        <span class="word-cloud-item text-xl bg-blue-100 text-blue-800">#여름세일</span>
                        <span class="word-cloud-item text-md">#시즌오프</span>
                        <span class="word-cloud-item text-lg bg-orange-100 text-orange-800">#특별할인</span>
                        <span class="word-cloud-item text-sm">#감성</span>
                        <span class="word-cloud-item text-2xl bg-green-100 text-green-800">#신제품</span>
                        <span class="word-cloud-item text-md">#한정판</span>
                    </div>
                </div>
            </div>
        `;
    }

    function renderDefaultDashboard() {
        destroyCharts();
        dashboardContainer.innerHTML = '';
    }

    function renderDashboard() {
        switch(state.currentView) {
            case 'performance':
                renderPerformanceDashboard();
                break;
            case 'creative':
                renderCreativeDashboard();
                break;
            default:
                renderDefaultDashboard();
        }
        lucide.createIcons();
    }
    
    function renderTags() {
        const allTags = new Set();
        promotions.forEach(p => {
            Object.values(p.tags).flat().forEach(tag => allTags.add(tag));
        });

        tagFiltersContainer.innerHTML = '';
        allTags.forEach(tag => {
            const tagButton = document.createElement('button');
            tagButton.className = 'tag-btn';
            tagButton.textContent = `#${tag}`;
            tagButton.dataset.tag = tag;
            tagFiltersContainer.appendChild(tagButton);
        });
    }
    
    function createPerformanceCard(p) {
        const tagsHtml = Object.values(p.tags).flat().slice(0, 3).map(tag =>
            `<span class="bg-slate-100 text-slate-600 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">#${tag}</span>`
        ).join('');

        // 브랜드별로 링크 지정
        let link;
        if (p.brand === '당근마켓') link = 'project/daangn/index.html';
        else if (p.brand === '뤼이드') link = 'project/riiid/index.html';
        else if (p.brand === '쓰리아이') link = 'project/threei/index.html';
        else if (p.brand === '오설록 자사몰' || p.brand === '오설록') link = 'project/osulloc/index.html';
        else if (p.brand === '위니 (소비기록 SNS)' || p.brand === 'winey') link = 'project/winey/index.html';
        else link = `project/detail/index.html?id=${p.id}`;

        return `
            <a href="${link}" class="promo-card performance-card">
                <div class="flex items-start justify-between gap-4">
                    <div class="flex items-center gap-3">
                        <span class="text-md font-bold text-slate-800">${p.brand}</span>
                    </div>
                    <div class="text-right flex-shrink-0">
                        <p class="text-2xl font-bold text-red-500">${p.discount}%</p>
                        <p class="text-xs font-semibold text-slate-500">${p.benefitType}</p>
                    </div>
                </div>
                <h3 class="text-lg font-semibold text-slate-800 leading-tight mt-3 flex-grow">${p.title}</h3>
                <div class="mt-3 mb-4">
                    ${tagsHtml}
                </div>
                <div class="text-xs text-slate-500 mt-auto border-t border-slate-200 pt-3">
                    <span>${p.startDate.replaceAll('-', '.')} ~ ${p.endDate.replaceAll('-', '.')}</span>
                </div>
            </a>
        `;
    }

    function createCreativeCard(p) {
        return `
            <a href="detail.html?id=${p.id}" class="promo-card creative-card">
                <img src="${p.image}" alt="${p.title}" class="card-bg-image">
                <div class="card-content">
                    <div class="flex items-center gap-2 mb-2">
                        <span class="text-sm font-semibold">${p.brand}</span>
                    </div>
                    <h3 class="text-xl font-bold leading-tight">${p.slogan}</h3>
                </div>
            </a>
        `;
    }
    
    function renderPromotions() {
        let filteredPromotions = [...promotions];
        filteredPromotions = filteredPromotions.filter(p => p.curationViews.includes(state.currentView));

        if (state.activeTags.size > 0) {
            filteredPromotions = filteredPromotions.filter(p => {
                const promoTags = new Set(Object.values(p.tags).flat());
                return [...state.activeTags].every(activeTag => promoTags.has(activeTag));
            });
        }
        
        if (state.searchTerm) {
            const lowerCaseSearchTerm = state.searchTerm.toLowerCase();
            filteredPromotions = filteredPromotions.filter(p => 
                p.title.toLowerCase().includes(lowerCaseSearchTerm) || 
                p.brand.toLowerCase().includes(lowerCaseSearchTerm)
            );
        }

        filteredPromotions.sort((a, b) => {
            switch (state.sortBy) {
                case 'popular': return b.popularityScore - a.popularityScore;
                case 'ending': return new Date(a.endDate) - new Date(b.endDate);
                case 'latest': default: return new Date(b.startDate) - new Date(a.startDate);
            }
        });
        
        promotionGrid.innerHTML = '';
        if (filteredPromotions.length === 0) {
            promotionGrid.className = 'col-span-full text-center py-10';
            promotionGrid.innerHTML = `<p class="text-slate-500">조건에 맞는 프로모션이 없습니다.</p>`;
            return;
        }

        let cardHtml = '';
        if (state.currentView === 'performance') {
            promotionGrid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';
            cardHtml = filteredPromotions.map(createPerformanceCard).join('');
        } else if (state.currentView === 'creative') {
            promotionGrid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';
            cardHtml = filteredPromotions.map(createCreativeCard).join('');
        } else {
             promotionGrid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';
             cardHtml = filteredPromotions.map(createPerformanceCard).join('');
        }
        promotionGrid.innerHTML = cardHtml;
    }

    function handleTabClick(e) {
        const button = e.target.closest('.tab-btn');
        if (!button || button.classList.contains('active')) return;

        curationTabs.querySelector('.active').classList.remove('active');
        button.classList.add('active');
        state.currentView = button.dataset.view;
        renderDashboard();
        renderPromotions();
    }
    
    function handleTagClick(e) {
        const button = e.target.closest('.tag-btn');
        if (!button) return;

        const tag = button.dataset.tag;
        button.classList.toggle('selected');
        
        if (state.activeTags.has(tag)) {
            state.activeTags.delete(tag);
        } else {
            state.activeTags.add(tag);
        }
        renderPromotions();
    }
    
    function handleSortChange(e) {
        state.sortBy = e.target.value;
        renderPromotions();
    }
    
    function handleSearch(e) {
        state.searchTerm = e.target.value;
        renderPromotions();
    }

    curationTabs.addEventListener('click', handleTabClick);
    tagFiltersContainer.addEventListener('click', handleTagClick);
    sortBySelect.addEventListener('change', handleSortChange);
    // searchInput.addEventListener('input', handleSearch); // 검색창 제거로 인해 주석 처리

    renderTags();
    renderDashboard();
    renderPromotions();
});
