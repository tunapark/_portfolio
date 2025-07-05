import { promotions } from './data.js';

document.addEventListener('DOMContentLoaded', () => {
    const mainContainer = document.getElementById('detail-main');
    const loadingDiv = document.getElementById('loading');

    const urlParams = new URLSearchParams(window.location.search);
    const projectId = parseInt(urlParams.get('id'));

    const project = promotions.find(p => p.id === projectId);

    if (project) {
        renderProjectDetails(project);
    } else {
        renderError();
    }

    function renderProjectDetails(p) {
        document.title = `${p.title} - 프로젝트 상세`;

        const allTags = Object.values(p.tags).flat();
        const tagsHtml = allTags.map(tag => `<span class="tag-btn !cursor-default selected">${tag}</span>`).join('');

        mainContainer.innerHTML = `
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="lg:col-span-2">
                    <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div class="flex items-start gap-4 mb-6">
                             <img src="${p.image}" alt="${p.title}" class="w-24 h-24 object-cover rounded-lg border border-slate-200">
                             <div>
                                 <h2 class="text-3xl font-bold">${p.title}</h2>
                                 <p class="text-slate-600 mt-1">${p.brand}</p>
                             </div>
                        </div>
                        <div class="prose max-w-none mb-8">
                            <p>${p.slogan}</p>
                        </div>
                        <div class="prose max-w-none mb-8">
                            <p>${p.description ? p.description : ''}</p>
                        </div>
                        <div>
                            <h3 class="text-xl font-bold mb-4">태그</h3>
                            <div class="flex flex-wrap gap-2">
                                ${tagsHtml}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="lg:col-span-1 space-y-6">
                     <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 class="text-lg font-bold mb-4">주요 정보</h3>
                        <div class="space-y-3 text-sm">
                            <div class="flex justify-between">
                                <span class="text-slate-500">진행 기간</span>
                                <span class="font-semibold">${p.startDate.replaceAll('-', '.')} ~ ${p.endDate.replaceAll('-', '.')}</span>
                            </div>
                             <div class="flex justify-between">
                                <span class="text-slate-500">인기 점수</span>
                                <span class="font-semibold text-accent">${p.popularityScore}점</span>
                            </div>
                        </div>
                     </div>
                </div>
            </div>
        `;
        loadingDiv.style.display = 'none';
        lucide.createIcons();
    }

    function renderError() {
        mainContainer.innerHTML = `
            <div class="text-center py-20 bg-white rounded-xl border border-slate-200 shadow-sm">
                <i data-lucide="alert-circle" class="w-16 h-16 text-red-500 mx-auto mb-4"></i>
                <h2 class="text-2xl font-bold mb-2">프로젝트를 찾을 수 없습니다.</h2>
                <p class="text-slate-500">요청하신 프로젝트 정보가 존재하지 않거나, 잘못된 경로로 접근하셨습니다.</p>
                <a href="index.html" class="btn-primary mt-6 inline-block">목록으로 돌아가기</a>
            </div>
        `;
        lucide.createIcons();
    }
});
