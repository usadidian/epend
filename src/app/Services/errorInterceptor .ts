import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";

export class ErrorInterceptor implements HttpInterceptor {
    constructor(private router: Router, private route: ActivatedRoute) {}

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        var res = next.handle(req);
        return res.pipe(
            catchError((error: HttpErrorResponse) => {
                // console.log("Interceptor Log: " + error.message);
                // console.log(this.router.routerState.snapshot.url);
                if (error.status == 401) {
                    this.router.navigate(["/login"]).then(() => {
                        window.location.reload();
                    });
                    // this.router.navigateByUrl("/login", {
                    //     state: {
                    //         originUrl: this.router.routerState.snapshot.url,
                    //     },
                    // });
                }
                return throwError(error);
            })
        );
    }
}
