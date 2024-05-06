import { Injectable } from "@angular/core";
import * as introJs from "intro.js/intro.js";

@Injectable({ providedIn: "root" })
export class IntroJSService {
    introJS = null;
    steps: any[] = [
        {
            element: "#sidebar",
            intro: "Selamat Datang di beranda ePad. Tour ini akan membantu anda untuk memulai ePad pertama kali. Ini adalah daftar menu aplikasi.",
        },
        {
            element: "#step1",
            intro: "Disini untuk pencarian cepat wajib pajak.",
        },
        {
            element: "#step2",
            intro: "Disini untuk melihat daftar notifikasi terakhir.",
        },
        {
            element: "#step3",
            intro: "Untuk membukan data profil anda.",
        },
        {
            element: "#rightpanel-menu-button",
            intro: "Untuk membuka obrolan dengan petugas lain atau wajib pajak.",
        },
        {
            element: "#step_logout",
            intro: "Tombol untuk keluar dari ePad.",
        },
        {
            element: "#layout-config-button",
            intro: "Setel tema ePad sesuai keinginan anda.",
        },
        {
            element: "#layout-config-button2",
            intro: "Untuk bertanya kepada Budi yang akan membantu anda jika mendapatkan kesulitan dalam pengoperasian ePad.",
        },
    ];

    featureOne() {
        let stepsOne = [];
        let last_step_id = 0;
        if (localStorage.getItem("ePad_feature_one")) {
            stepsOne = JSON.parse(localStorage.getItem("ePad_feature_one"));
            const last_step = stepsOne[stepsOne.length - 1];
            if (last_step !== "done!") {
                last_step_id = stepsOne.length;
                this.startFeatureOne(stepsOne, last_step_id);
            }
        } else {
            this.startFeatureOne(stepsOne, last_step_id);
        }
    }

    startFeatureOne(stepsOneFirst, last_step_id) {
        const stepsOne = stepsOneFirst;
        this.introJS = introJs();
        this.introJS.start();
        if (last_step_id > 0) {
            this.introJS.goToStep(last_step_id);
        }

        this.introJS
            .setOptions({
                doneLabel: "Selesai",
                nextLabel: " > ",
                prevLabel: " < ",
                skipLabel: "ingatkan nanti",
                steps: this.steps,
            })
            .onchange(function (targetElement) {
                if (!stepsOne.includes(targetElement.id)) {
                    stepsOne.push(targetElement.id);
                }

                localStorage.setItem(
                    "ePad_feature_one",
                    JSON.stringify(stepsOne)
                );
            })
            .oncomplete(function () {
                stepsOne.push("done!");
                localStorage.setItem(
                    "ePad_feature_one",
                    JSON.stringify(stepsOne)
                );
            })
            .start();
        if (last_step_id > 0) {
            this.introJS.goToStep(last_step_id);
        }
    }

    steps_mobile: any[] = [
        {
            element: "#menu-button",
            intro: "Selamat Datang di beranda ePad. Tour ini akan membantu anda untuk memulai ePad pertama kali. Ini adalah tombol untuk melihat daftar menu aplikasi.",
        },
        {
            element: ".bottomNavBar ",
            intro: "Navigasi utama ePad.",
        },
        {
            element: "#topbar-menu-button",
            intro: "Menu Profil, Pemberitahuan dan pencarian wajib pajak.",
        },
        {
            element: "#rightpanel-menu-button",
            intro: "Untuk membuka obrolan dengan petugas lain atau wajib pajak.",
        },
        {
            element: "#step_logout",
            intro: "Tombol untuk keluar dari ePad.",
        },
        {
            element: "#layout-config-button",
            intro: "Setel tema ePad sesuai keinginan anda.",
        },
        {
            element: "#layout-config-button2",
            intro: "Untuk bertanya kepada Budi yang akan membantu anda jika mendapatkan kesulitan dalam pengoperasian ePad.",
        },
    ];

    featureOneMobile() {
        let stepsOne = [];
        let last_step_id = 0;
        if (localStorage.getItem("ePad_feature_one_mobile")) {
            stepsOne = JSON.parse(
                localStorage.getItem("ePad_feature_one_mobile")
            );
            const last_step = stepsOne[stepsOne.length - 1];
            if (last_step !== "done!") {
                last_step_id = stepsOne.length;
                this.startFeatureOneMobile(stepsOne, last_step_id);
            }
        } else {
            this.startFeatureOneMobile(stepsOne, last_step_id);
        }
    }

    startFeatureOneMobile(stepsOneFirst, last_step_id) {
        const stepsOne = stepsOneFirst;
        this.introJS = introJs();
        this.introJS.start();
        if (last_step_id > 0) {
            this.introJS.goToStep(last_step_id);
        }

        this.introJS
            .setOptions({
                doneLabel: "Selesai",
                nextLabel: " > ",
                prevLabel: " < ",
                skipLabel: "ingatkan nanti",
                steps: this.steps_mobile,
            })
            .onchange(function (targetElement) {
                if (!stepsOne.includes(targetElement.id)) {
                    stepsOne.push(targetElement.id);
                }

                localStorage.setItem(
                    "ePad_feature_one_mobile",
                    JSON.stringify(stepsOne)
                );
            })
            .oncomplete(function () {
                stepsOne.push("done!");
                localStorage.setItem(
                    "ePad_feature_one_mobile",
                    JSON.stringify(stepsOne)
                );
            })
            .start();
        if (last_step_id > 0) {
            this.introJS.goToStep(last_step_id);
        }
    }

    // featureTwo() {
    //     this.introJS = introJs();
    //     this.introJS.start();

    //     this.introJS
    //         .setOptions({
    //             steps: [
    //                 {
    //                     element: "#step3",
    //                     intro: "You can rename your experience by pressing on the pen",
    //                 },
    //                 {
    //                     element: "#step4",
    //                     intro: "All of your changes are saved automatically, you can see the saving status here",
    //                 },
    //                 {
    //                     element: "#step5",
    //                     intro: "If you want to navigate back to the list or log out, press on the logo here",
    //                     tooltipPosition: "bottom",
    //                 },
    //                 {
    //                     element: "#step6",
    //                     intro: "The storyboard contains your scenes",
    //                 },
    //             ],
    //         })
    //         .start();
    // }
}
