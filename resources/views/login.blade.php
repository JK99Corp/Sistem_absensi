<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistem Absensi Jaya Kedhaton - Login</title>
    <link rel="icon" type="image/png" href="{{ asset('images/logo.png') }}">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
</head>
<body class="bg-slate-100 min-h-screen flex items-center justify-center p-4">

    <div class="w-full max-w-md">
        {{-- Login Card --}}
        <div class="bg-white rounded-2xl shadow-xl p-8 md:p-10">

            {{-- Logo / Title --}}
            <div class="text-center mb-8">
                <img src="{{ asset('images/logo.png') }}" alt="Logo Jaya Kedhaton" 
                     class="w-24 h-24 mx-auto object-contain mb-3 drop-shadow-sm">
                <h1 class="text-2xl font-bold text-slate-800">Jaya Kedhaton</h1>
                <p class="text-slate-500 text-sm mt-1">Sistem Absensi Digital</p>
            </div>

            {{-- Error Messages --}}
            @if (isset($error) || session('error'))
                <div class="bg-red-50 border border-red-200 text-red-700 rounded-lg px-5 py-4 mb-6 text-base">
                    <i class="fas fa-exclamation-circle mr-2"></i>
                    {{ $error ?? session('error') }}
                </div>
            @endif

            @if ($errors->any())
                <div class="bg-red-50 border border-red-200 text-red-700 rounded-lg px-5 py-4 mb-6 text-base">
                    <i class="fas fa-exclamation-circle mr-2"></i>
                    @foreach ($errors->all() as $err)
                        <p>{{ $err }}</p>
                    @endforeach
                </div>
            @endif

            {{-- Login Form --}}
            <form method="POST" action="{{ url('/login') }}">
                @csrf

                {{-- Username --}}
                <div class="mb-5">
                    <label for="username" class="block text-base font-semibold text-slate-700 mb-2">
                        <i class="fas fa-user mr-1 text-slate-400"></i> Username
                    </label>
                    <input type="text" id="username" name="username"
                           value="{{ old('username') }}"
                           placeholder="Masukkan username Anda"
                           class="w-full border border-slate-300 rounded-lg px-5 py-3.5 text-lg text-slate-800
                                  focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                                  placeholder:text-slate-400 transition-colors duration-200"
                           required autofocus>
                </div>

                {{-- Password --}}
                <div class="mb-8">
                    <label for="password" class="block text-base font-semibold text-slate-700 mb-2">
                        <i class="fas fa-lock mr-1 text-slate-400"></i> Password
                    </label>
                    <input type="password" id="password" name="password"
                           placeholder="Masukkan password Anda"
                           class="w-full border border-slate-300 rounded-lg px-5 py-3.5 text-lg text-slate-800
                                  focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                                  placeholder:text-slate-400 transition-colors duration-200"
                           required>
                </div>

                {{-- Submit Button --}}
                <button type="submit"
                        class="w-full bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold
                               py-4 px-6 rounded-lg text-lg transition-colors duration-200 shadow-md hover:shadow-lg">
                    <i class="fas fa-sign-in-alt mr-2"></i>
                    Masuk
                </button>
            </form>
        </div>

        {{-- Footer --}}
        <p class="text-center text-slate-400 text-sm mt-6">&copy; {{ date('Y') }} Sistem Absensi Jaya Kedhaton</p>
    </div>

</body>
</html>
