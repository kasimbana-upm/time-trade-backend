import { CallHandler, ExecutionContext, Injectable, NestInterceptor, ConflictException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from "rxjs/operators";
import { MongoError } from "mongodb";

@Injectable()
export class UserEmailConflictInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle()
            .pipe(catchError(error => {
                if(error instanceof MongoError && error.message.includes("duplicate key error")) {
                    throw new ConflictException("Ya existe un usuario con este email");
                }
                throw error;
            }));
    }
}
