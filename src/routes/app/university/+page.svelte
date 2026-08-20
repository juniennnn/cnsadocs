<script lang="ts">
    type CityDetail = {
        before: string;
        linkText: string;
        url: string;
        after: string;
    };

    type University = {
        name: string;
        universityUrl: string;
        score: string;
        scoreNote: string;
        commonRequirement: string;
        subjectLinkText: string;
        subjectUrl: string;
        subjectNote?: string;
        cityDetails?: CityDetail[];
    };

    const universities: University[] = [
        {
            name: 'The University of Hong Kong (HKU)',
            universityUrl:
                'https://admissions.hku.hk/apply/international-qualifications',
            score: '37~43',
            scoreNote: '상위 25%~75% 점수대 분포 예상치, 비공식',
            commonRequirement:
                'Grade 4 in IB English B HL OR Grade 5 in IB English B SL',
            subjectLinkText: 'Website',
            subjectUrl:
                'https://admissions.hku.hk/apply/international-qualifications#admissions-standard',
            subjectNote: '공식 문서가 없어, 추후 보강 필요'
        },
        {
            name: 'The Chinese University of Hong Kong (CUHK)',
            universityUrl:
                'https://admission.cuhk.edu.hk/application/overseas-other-qualifications-non-local-international-team/requirements/',
            score: '37~43',
            scoreNote: '2025년 합격자 기준 상위 25%~75% 점수대 분포',
            commonRequirement:
                'Grade 4 in IB English HL / SL (A/B 확인 필요)',
            subjectLinkText: 'Subject Preferences of the Programmes',
            subjectUrl: 'https://www.cuhk.edu.hk/adm/intl/adm_guide/IB.pdf'
        },
        {
            name: 'The Hong Kong University of Science and Technology (HKUST)',
            universityUrl:
                'https://join.hkust.edu.hk/admissions/international-qualifications',
            score: '35~40',
            scoreNote: '2025년 합격자 기준 상위 25%~75% 점수대 분포',
            commonRequirement:
                'Grade 4 in IB English B HL OR Grade 5 in IB English B SL',
            subjectLinkText:
                'HKUST Admissions 2026 - International Qualifications brochure',
            subjectUrl: 'https://publication.join.ust.hk/view/14363550/8-9/'
        },
        {
            name: 'The Hong Kong Polytechnic University (PolyU)',
            universityUrl:
                'https://www.polyu.edu.hk/study/ug/admissions/international-other-qualifications',
            score: '32~39',
            scoreNote: '2025년 합격자 기준 상위 25%~75% 점수대 분포',
            commonRequirement:
                'Grade 4 in IB English HL / SL (A/B 확인 필요)',
            subjectLinkText: 'Preferred Subjects',
            subjectUrl:
                'https://www.polyu.edu.hk/study/ug/admissions/international-other-qualifications/international-other-qualifications-preferred'
        },
        {
            name: 'City University of Hong Kong (CityU)',
            universityUrl:
                'https://www.cityu.edu.hk/admo/admissions/international-admissions',
            score: '32~38',
            scoreNote: '2025년 합격자 기준 상위 25%~75% 점수대 분포',
            commonRequirement:
                'Grade 4 in IB English B HL OR Grade 5 in IB English B SL',
            subjectLinkText: 'International Baccalaureate Mathematics',
            subjectUrl:
                'https://www.cityu.edu.hk/admo/aims/direct/IB_mathematics.pdf',
            cityDetails: [
                {
                    before:
                        'Bachelor of Veterinary Medicine (BVM, JS1801)은 ',
                    linkText: 'Biology HL',
                    url: 'https://www.cityu.edu.hk/jcc/education/undergraduate-programmes/bachelor-veterinary-medicine/admission/direct-non-jupas-applicants',
                    after: ' 조건 때문에 불가능.'
                },
                {
                    before: 'Bachelor of Laws (LLB, JS1061)은 ',
                    linkText: 'Grade 6',
                    url: 'https://www.cityu.edu.hk/admo/programmes/bachelor-laws',
                    after: ' in IB English HL/SL 필요 (A/B 확인 필요)'
                },
                {
                    before: 'BA English (JS1104)은 ',
                    linkText: 'TOEFL 102점',
                    url: 'https://www.cityu.edu.hk/admo/programmes/ba-english',
                    after: ' OR '
                },
                {
                    before: '',
                    linkText: 'IELTS 7.0점',
                    url: 'https://www.cityu.edu.hk/admo/programmes/ba-english',
                    after: ' 필요'
                }
            ]
        },
        {
            name: 'Hong Kong Baptist University (HKBU)',
            universityUrl:
                'https://admissions.hkbu.edu.hk/admissions/international-qualifications.html?filter-1-hkdse=hongkongbaptistuniversity%3Aao%2Fqualification%2Finternational-qualifications&filter-1-page=0&filter-0-post-secondary-qualifications=hongkongbaptistuniversity%3Aao%2Fnews%2Finternational-qualifications&filter-0-page=1',
            score: '30~35',
            scoreNote: '2025년 합격자 기준 상위 25%~75% 점수대 분포',
            commonRequirement:
                'Grade 4 in IB English B HL OR Grade 5 in IB English B SL',
            subjectLinkText: 'Programme Entrance Requirements',
            subjectUrl:
                'https://admissions.hkbu.edu.hk/admissions/international-qualifications.html?tabs2=tab-2-3-tab&filter-0-post-secondary-qualifications=hongkongbaptistuniversity%3Aao%2Fnews%2Finternational-qualifications&filter-0-page=1&filter-1-hkdse=hongkongbaptistuniversity%3Aao%2Fqualification%2Finternational-qualifications&filter-1-page=0&tabs3=tab-2-4-tab#accordion-9694643464-item-3de9ea561a'
        }
    ];

    const linkClass =
        'text-zinc-600 underline decoration-zinc-400 underline-offset-2 transition hover:text-amber-600';
</script>

<svelte:head>
    <title>홍콩 대학 입시 정보</title>
    <meta
        name="description"
        content="홍콩 주요 대학의 IB 입학 점수와 입학 요건"
    />
</svelte:head>

<main class="mx-auto max-w-7xl px-5 py-10 sm:px-8">
    <section>
        <h1 class="text-3xl font-bold text-zinc-900">
            홍콩
        </h1>

        <ul class="mt-8 list-disc space-y-4 pl-6 text-base leading-7 text-zinc-800">
            <li>
                <span>홍콩의 입시 시스템: </span>
                <strong>JUPAS / Non-JUPAS</strong>

                <ul class="mt-2 list-circle space-y-2 pl-8">
                    <li>
                        통합 포털 없음, 각 대학 홈페이지에서 개별적으로 지원
                    </li>

                    <li>
                        Quota는 없지만 각 대학마다 요구하는 양식이 다름
                    </li>
                </ul>
            </li>

            <li>
                <span>홍콩 학생 비자 (Student Visa / Entry Permit)</span>

                <p class="mt-1">
                    → 대부분 대학이 sponsor 역할을 함, 대학교 application
                    portal에서 학생비자 신청 진행, 혹은 ImmD에 직접 신청
                </p>

                <ul class="mt-2 list-circle space-y-2 pl-8">
                    <li>
                        이후 IANG (Immigration Arrangements for Non-local
                        Graduates)
                        <br />
                        → 졸업 후 무조건적 2년치 비자 제공.
                    </li>
                </ul>
            </li>
        </ul>
    </section>

    <section class="mt-10">
        <div class="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
            <table class="w-full min-w-275 border-collapse text-left">
                <thead>
                    <tr class="bg-zinc-50">
                        <th
                            class="w-[23%] border-b border-r border-zinc-200 px-4 py-4 align-top font-medium text-zinc-900"
                        >
                            대학명
                        </th>

                        <th
                            class="w-[23%] border-b border-r border-zinc-200 px-4 py-4 align-top font-medium text-zinc-900"
                        >
                            권장 점수 (레퍼런스)
                        </th>

                        <th
                            class="w-[21%] border-b border-r border-zinc-200 px-4 py-4 align-top font-medium text-zinc-900"
                        >
                            Common Requirements
                            <br />
                            (IBDP 취득 기준)
                        </th>

                        <th
                            class="w-[33%] border-b border-zinc-200 px-4 py-4 align-top font-medium text-zinc-900"
                        >
                            Subject Requirements
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {#each universities as university}
                        <tr class="transition hover:bg-amber-50/50">
                            <td
                                class="border-b border-r border-zinc-200 px-4 py-4 align-top leading-7"
                            >
                                <a
                                    href={university.universityUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class={linkClass}
                                >
                                    {university.name}
                                </a>
                            </td>

                            <td
                                class="border-b border-r border-zinc-200 px-4 py-4 align-top leading-7 text-zinc-800"
                            >
                                <strong class="text-zinc-800">
                                    {university.score}
                                </strong>

                                <span>
                                    ({university.scoreNote})
                                </span>
                            </td>

                            <td
                                class="border-b border-r border-zinc-200 px-4 py-4 align-top leading-7 text-zinc-800"
                            >
                                {university.commonRequirement}
                            </td>

                            <td
                                class="border-b border-zinc-200 px-4 py-4 align-top leading-7 text-zinc-800"
                            >
                                <a
                                    href={university.subjectUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class={linkClass}
                                >
                                    [{university.subjectLinkText}]
                                </a>

                                {#if university.subjectNote}
                                    <p class="mt-1">
                                        ({university.subjectNote})
                                    </p>
                                {/if}

                                {#if university.cityDetails}
                                    <ul class="mt-5 list-disc space-y-2 pl-6">
                                        <li>
                                            {university.cityDetails[0].before}

                                            <a
                                                href={university.cityDetails[0].url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                class={linkClass}
                                            >
                                                {university.cityDetails[0].linkText}
                                            </a>

                                            {university.cityDetails[0].after}
                                        </li>

                                        <li>
                                            {university.cityDetails[1].before}

                                            <a
                                                href={university.cityDetails[1].url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                class={linkClass}
                                            >
                                                {university.cityDetails[1].linkText}
                                            </a>

                                            {university.cityDetails[1].after}
                                        </li>

                                        <li>
                                            {university.cityDetails[2].before}

                                            <a
                                                href={university.cityDetails[2].url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                class={linkClass}
                                            >
                                                {university.cityDetails[2].linkText}
                                            </a>

                                            {university.cityDetails[2].after}

                                            <a
                                                href={university.cityDetails[3].url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                class={linkClass}
                                            >
                                                {university.cityDetails[3].linkText}
                                            </a>

                                            {university.cityDetails[3].after}
                                        </li>
                                    </ul>
                                {/if}
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>

        <p class="mt-4 text-sm leading-6 text-zinc-500">
            점수와 입학 요건은 참고용입니다. 링크된 각 대학의 공식 페이지에서
            최신 조건을 확인하세요.
        </p>
    </section>
</main>